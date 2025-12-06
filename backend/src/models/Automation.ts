import mongoose from "mongoose";

const AutomationSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  label: String,
  params: [String]
});

export default mongoose.model("Automation", AutomationSchema);
