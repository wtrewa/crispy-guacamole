import mongoose from "mongoose";

const WorkflowSchema = new mongoose.Schema(
  {
    name: String,
    nodes: Array,
    edges: Array
  },
  { timestamps: true }
);

export default mongoose.model("Workflow", WorkflowSchema);
