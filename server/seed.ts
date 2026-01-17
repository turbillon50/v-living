import { storage } from "./storage";

const seedProperties = [
  {
    category: "Propiedades",
    title: "Propiedad",
    location: "Ubicación",
    description: "Descripción pendiente",
    images: [],
    conditions: []
  },
  {
    category: "Propiedades",
    title: "Propiedad",
    location: "Ubicación",
    description: "Descripción pendiente",
    images: [],
    conditions: []
  },
  {
    category: "Propiedades",
    title: "Propiedad",
    location: "Ubicación",
    description: "Descripción pendiente",
    images: [],
    conditions: []
  },
  {
    category: "Propiedades",
    title: "Propiedad",
    location: "Ubicación",
    description: "Descripción pendiente",
    images: [],
    conditions: []
  }
];

async function seed() {
  try {
    console.log("🌱 Seeding database...");
    
    const existing = await storage.getProperties();
    if (existing.length > 0) {
      console.log("✅ Database already seeded");
      return;
    }

    for (const prop of seedProperties) {
      await storage.createProperty(prop);
    }

    console.log("✅ Database seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seed();
