import Automation from "../models/Automation";
import { connectDatabase, disconnectDatabase } from "../config/database";

async function seed() {
  await connectDatabase();

  await Automation.deleteMany({});
  await Automation.insertMany([
    { id: "send_email", label: "Send Email", params: ["to", "subject"] },
    { id: "generate_doc", label: "Generate Document", params: ["template", "recipient"] }
  ]);

  console.log("Seeded automations ✔");
  await disconnectDatabase();
}

seed();
