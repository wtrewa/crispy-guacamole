// src/services/simulate.service.ts

import { WorkflowGraph } from "../types/workflow.types";

export function simulateWorkflow(graph: WorkflowGraph) {
  const steps = graph.nodes.map((node, index) => ({
    nodeId: node.id,
    status: "completed",
    message: `Executed: ${node.title}`,
    timestamp: new Date(Date.now() + index * 1000).toISOString(),
  }));

  return {
    success: true,
    steps,
    duration: steps.length * 1000,
  };
}
