import { Storage } from "@google-cloud/storage";
import fs from "fs";
import path from "path";
import { db } from "../server/db";
import { properties } from "../shared/schema";
import { eq } from "drizzle-orm";

const REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106";

const storage = new Storage({
  credentials: {
    audience: "replit",
    subject_token_type: "access_token",
    token_url: `${REPLIT_SIDECAR_ENDPOINT}/token`,
    type: "external_account",
    credential_source: {
      url: `${REPLIT_SIDECAR_ENDPOINT}/credential`,
      format: { type: "json", subject_token_field_name: "access_token" },
    },
    universe_domain: "googleapis.com",
  },
  projectId: "",
});

const BUCKET_ID = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID || "replit-objstore-3ffe7255-9cde-44a4-9d40-5e839a71f0d7";

async function uploadImage(localPath: string): Promise<string> {
  const fileName = path.basename(localPath);
  const bucket = storage.bucket(BUCKET_ID);
  const destPath = `public/${fileName}`;
  
  await bucket.upload(localPath, {
    destination: destPath,
    metadata: { contentType: "image/jpeg" },
  });
  
  console.log(`Uploaded: ${fileName}`);
  return `/${BUCKET_ID}/${destPath}`;
}

async function main() {
  console.log("Starting image upload to object storage...");
  
  // Get all properties
  const allProperties = await db.select().from(properties);
  
  for (const prop of allProperties) {
    if (!prop.images || prop.images.length === 0) continue;
    
    const newImages: string[] = [];
    
    for (const imgPath of prop.images) {
      if (imgPath.startsWith("/attached_assets/")) {
        const localPath = imgPath.replace("/attached_assets/", "attached_assets/");
        
        if (fs.existsSync(localPath)) {
          try {
            const cloudPath = await uploadImage(localPath);
            newImages.push(cloudPath);
          } catch (err) {
            console.error(`Failed to upload ${localPath}:`, err);
            newImages.push(imgPath); // Keep original if failed
          }
        } else {
          console.log(`File not found: ${localPath}`);
          newImages.push(imgPath);
        }
      } else {
        newImages.push(imgPath);
      }
    }
    
    // Update property with new image URLs
    await db.update(properties).set({ images: newImages }).where(eq(properties.id, prop.id));
    console.log(`Updated property: ${prop.title}`);
  }
  
  console.log("Done!");
  process.exit(0);
}

main().catch(console.error);
