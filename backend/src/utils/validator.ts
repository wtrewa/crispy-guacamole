import { WorkflowGraph } from "../types/workflow.types";

export function validateWorkflow(graph: WorkflowGraph): string[] {
  const errors: string[] = [];

  // Extract START and END nodes from data.type
  const startNodes = graph.nodes.filter((n) => n.data.type === "start");
  if (startNodes.length === 0) errors.push("Workflow must contain 1 Start node");
  if (startNodes.length > 1) errors.push("Workflow must contain ONLY 1 Start node");

  const endNodes = graph.nodes.filter((n) => n.data.type === "end");
  if (endNodes.length === 0) errors.push("Workflow should contain at least 1 End node");

  graph.nodes.forEach((node) => {
    const data = node.data;
    const outgoing = graph.edges.filter((e) => e.source === node.id);

    // All nodes except end must have outgoing connections
    if (data.type !== "end" && outgoing.length === 0) {
      errors.push(`Node "${data.label}" has no outgoing connection`);
    }

    // Approval validations
    if (data.type === "approval" && !(data as any).approverRole) {
      errors.push(`Approval node "${data.label}" must have an approverRole`);
    }

    // Automated step validations
    if (data.type === "automated") {
      const auto = data as any;
      if (!auto.actionId) {
        errors.push(`Automated node "${data.label}" must choose an action`);
      }
    }
  });

  return errors;
}
