import { storage } from "./storage";

const seedProperties = [
  {
    category: "Propiedades",
    title: "Casa Infinity",
    location: "Marbella, Spain",
    description: "A masterpiece of modern design overlooking the Mediterranean. Experience the pinnacle of coastal living with infinity pools and private beach access.",
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600596542815-e32870110274?auto=format&fit=crop&w=1600&q=80"
    ],
    conditions: ["3 Weeks Minimum", "No Pets", "Max 10 Guests"]
  },
  {
    category: "Yachts",
    title: "Ocean Sovereign",
    location: "Monaco Port",
    description: "40m Superyacht available for fractional ownership. Explore the French Riviera in unmatched style and comfort.",
    images: [
      "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=1600&q=80"
    ],
    conditions: ["Crew Included", "Fuel Extra", "Port Fees Excluded"]
  },
  {
    category: "Commercial",
    title: "Tech Hub One",
    location: "Dubai, UAE",
    description: "Premium office space in the heart of Innovation District. Smart building features and exclusive networking access.",
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80"
    ],
    conditions: ["Commercial License Required", "5 Year Lease Minimum"]
  },
  {
    category: "Experiences",
    title: "Alpine Heli-Skiing",
    location: "Zermatt, Switzerland",
    description: "Exclusive access to untouched powder runs. Includes private guide and gourmet mountain dining.",
    images: [
      "https://images.unsplash.com/photo-1551524164-687a55dd1126?auto=format&fit=crop&w=1600&q=80"
    ],
    conditions: ["Advanced Ski Level", "Insurance Required"]
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
