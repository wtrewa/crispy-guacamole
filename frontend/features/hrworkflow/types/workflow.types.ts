import { Edge, Node } from "reactflow";

export type NodeDataType = "start" | "task" | "approval" | "automated" | "end";

export interface BaseNodeData {
  label: string;
  type: NodeDataType;
  isValid?: boolean;
  validationError?: string;
}

export interface StartNodeData extends BaseNodeData {
  type: "start";
  title: string;
  metadata: { key: string; value: string }[];
}

export interface TaskNodeData extends BaseNodeData {
  type: "task";
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  customFields: { key: string; value: string }[];
}

export interface ApprovalNodeData extends BaseNodeData {
  type: "approval";
  title: string;
  approverRole: string;
  autoApproveThreshold: number;
}

export interface AutomatedNodeData extends BaseNodeData {
  type: "automated";
  title: string;
  actionId: string;
  parameters: { [key: string]: string };
}

export interface EndNodeData extends BaseNodeData {
  type: "end";
  endMessage: string;
  summaryFlag: boolean;
}

export type WorkflowNodeData = StartNodeData | TaskNodeData | ApprovalNodeData | AutomatedNodeData | EndNodeData;

export interface SimulationStep {
  nodeId: string;
  status: "completed" | "pending" | "failed";
  message: string;
  timestamp: string;
}

export interface AutomationAction {
  id: string;
  label: string;
  params: string[];
}

export interface KeyValuePair {
  key: string;
  value: string;
}

export interface HistoryState {
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
}





