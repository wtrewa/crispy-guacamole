import { BACKEND_URL, FALLBACK_AUTOMATIONS } from "../constants/workflow.contants";
import { AutomationAction } from "../types/workflow.types";

 // services/workflowService.ts
import { Node, Edge } from "reactflow";
const BASE_URL = `${BACKEND_URL}/workflow`;

export const fetchAutomationsService = async () => {
  const res = await fetch(`${BASE_URL}/automations`);
  if (!res.ok) throw new Error("Failed to fetch automations");
  return res.json();
};

export const validateWorkflowService = async (payload: {
  nodes: Node[];
  edges: Edge[];
}) => {
  const res = await fetch(`${BASE_URL}/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  if (!res.ok)
    throw new Error(json.errors ? json.errors.join("\n") : "Validation failed");

  return json;
};

export const simulateWorkflowService = async (payload: {
  nodes: Node[];
  edges: Edge[];
}) => {
  const res = await fetch(`${BASE_URL}/simulate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  if (!res.ok)
    throw new Error(json.errors ? json.errors.join("\n") : "Simulation failed");

  return json;
};
