import React from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { AlertCircle } from "lucide-react";
import { NodeDataType, WorkflowNodeData } from "../types/workflow.types";

// Define proper props type for React Flow
type CustomNodeComponentProps = NodeProps<WorkflowNodeData>;

const CustomNode: React.FC<CustomNodeComponentProps> = ({ data, selected, id }) => {
  const colors: Record<NodeDataType, string> = {
    start: "bg-green-100 border-green-500",
    task: "bg-blue-100 border-blue-500",
    approval: "bg-yellow-100 border-yellow-500",
    automated: "bg-purple-100 border-purple-500",
    end: "bg-red-100 border-red-500",
  };

  const icons: Record<NodeDataType, string> = {
    start: "🚀",
    task: "📋",
    approval: "✓",
    automated: "⚙️",
    end: "🏁",
  };

  const showOutput = data.type !== "end";
  const showInput = data.type !== "start";

  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 shadow-md min-w-[180px] ${
        colors[data.type]
      } ${selected ? "ring-2 ring-offset-2 ring-blue-500" : ""}`}
    >
      {showInput && (
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 !bg-gray-600 border-2 border-white"
          style={{ top: -6 }}
        />
      )}
      <div className="flex items-center gap-2 font-semibold text-sm">
        <span>{icons[data.type]}</span>
        <span>{data.label}</span>
      </div>
      {!data.isValid && (
        <div className="mt-1 text-xs text-red-600 flex items-center gap-1">
          <AlertCircle size={12} />
          <span>Incomplete</span>
        </div>
      )}
      {showOutput && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 !bg-blue-600 border-2 border-white"
          style={{ bottom: -6 }}
        />
      )}
    </div>
  );
};

export default CustomNode;