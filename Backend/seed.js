import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const seedUsers = [
  { name: "Karthik Raja", age: 34, email: "patient1@example.com", password: "patient123", role: "patient" },
  { name: "Meena Sundaram", age: 58, email: "patient2@example.com", password: "patient123", role: "patient" },
  { name: "Arun Prakash", age: 21, email: "patient3@example.com", password: "patient123", role: "patient" },

  { name: "Nurse Divya", age: 29, email: "nurse@carequeue.com", password: "nurse123", role: "nurse" },
  { name: "Dr. Suresh Kumar", age: 45, email: "doctor@carequeue.com", password: "doctor123", role: "doctor" },
  { name: "Admin", age: 30, email: "admin@carequeue.com", password: "admin123", role: "admin" },
];

const runSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding...");

    await User.deleteMany({});
    console.log("Old users cleared");

    // Drop the old "mobile" index left over from before the email migration, if it exists
    try {
      await User.collection.dropIndex("mobile_1");
      console.log("Dropped old 'mobile' index");
    } catch (err) {
      console.log("No old 'mobile' index to drop (already clean)");
    }

    for (const u of seedUsers) {
      await User.create(u);
    }

    console.log("Seed data inserted successfully:");
    console.table(seedUsers.map(({ password, ...rest }) => rest));

    process.exit();
  } catch (error) {
    console.error("Seeding error:", error.message);
    process.exit(1);
  }
};

runSeed();