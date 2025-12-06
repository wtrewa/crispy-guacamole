import { AutomationAction, NodeDataType } from "../types/workflow.types";

export const BACKEND_URL = ((process.env.REACT_APP_BACKEND_URL as string) || 
  (process.env.VITE_BACKEND_URL as string) || 
  "http://localhost:5000/api/v1").replace(/\/$/, "");

export const NODE_COLORS: Record<NodeDataType, string> = {
  start: "bg-green-100 border-green-500",
  task: "bg-blue-100 border-blue-500",
  approval: "bg-yellow-100 border-yellow-500",
  automated: "bg-purple-100 border-purple-500",
  end: "bg-red-100 border-red-500",
};

export const NODE_ICONS: Record<NodeDataType, string> = {
  start: "🚀",
  task: "📋",
  approval: "✓",
  automated: "⚙️",
  end: "🏁",
};

export const MINIMAP_COLORS: Record<NodeDataType, string> = {
  start: '#86efac',
  task: '#93c5fd',
  approval: '#fde047',
  automated: '#c084fc',
  end: '#fca5a5'
};

export const NODE_TYPE_CONFIGS = [
  { type: "start" as NodeDataType, label: "Start", icon: "🚀", desc: "Entry point" },
  { type: "task" as NodeDataType, label: "Task", icon: "📋", desc: "Human task" },
  { type: "approval" as NodeDataType, label: "Approval", icon: "✓", desc: "Review step" },
  { type: "automated" as NodeDataType, label: "Automated", icon: "⚙️", desc: "System action" },
  { type: "end" as NodeDataType, label: "End", icon: "🏁", desc: "Completion" },
];

export const FALLBACK_AUTOMATIONS: AutomationAction[] = [
  { id: "send_email", label: "Send Email", params: ["to", "subject", "body"] },
  { id: "generate_doc", label: "Generate Document", params: ["template", "recipient"] },
];