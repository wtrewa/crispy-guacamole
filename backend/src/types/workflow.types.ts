// src/types/workflow.types.ts

export type NodeDataType = 'start' | 'task' | 'approval' | 'automated' | 'end';

export interface WorkflowNodeBase {
  id: string;
  label: string;
  title:string;
  type: NodeDataType;
}

export interface StartNode extends WorkflowNodeBase {
  type: 'start';
  title: string;
  metadata: { key: string; value: string }[];
}

export interface TaskNode extends WorkflowNodeBase {
  type: 'task';
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  customFields: { key: string; value: string }[];
}

export interface ApprovalNode extends WorkflowNodeBase {
  type: 'approval';
  title: string;
  approverRole: string;
  autoApproveThreshold: number;
}

export interface AutomatedNode extends WorkflowNodeBase {
  type: 'automated';
  title: string;
  actionId: string;
  parameters: Record<string, string>;
}

export interface EndNode extends WorkflowNodeBase {
  type: 'end';
  endMessage: string;
  summaryFlag: boolean;
}

export type WorkflowNode =
  | StartNode
  | TaskNode
  | ApprovalNode
  | AutomatedNode
  | EndNode;

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
}

export interface WorkflowGraph {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}
