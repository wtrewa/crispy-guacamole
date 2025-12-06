import { Trash2 } from "lucide-react";
import { ApprovalNodeData, AutomatedNodeData, AutomationAction, EndNodeData, StartNodeData, TaskNodeData, WorkflowNodeData } from "../../types/workflow.types";
import { Node } from "reactflow";
import { useCallback } from "react";




interface NodeEditorProps {
  node: Node<WorkflowNodeData> | null;
  onUpdate: (id: string, data: Partial<WorkflowNodeData>) => void;
  onDelete: (id: string) => void;
  automations: AutomationAction[];
}

const NodeEditor: React.FC<NodeEditorProps> = ({ 
  node, 
  onUpdate, 
  onDelete, 
  automations 
}) => {
  if (!node) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-4">
        <div className="text-center mt-8">
          <div className="text-4xl mb-3">👈</div>
          <p className="text-gray-500">Select a node to edit its properties</p>
        </div>
      </div>
    );
  }

  const data = node.data;

  // Helper functions for key-value editing
  const addKeyValue = useCallback((field: "metadata" | "customFields") => {
    const current = (data as any)[field] || [];
    onUpdate(node.id, { [field]: [...current, { key: "", value: "" }] } as any);
  }, [data, node.id, onUpdate]);

  const updateKeyValue = useCallback((
    field: "metadata" | "customFields", 
    index: number, 
    key: string, 
    value: string
  ) => {
    const current = [...(data as any)[field]];
    current[index] = { key, value };
    onUpdate(node.id, { [field]: current } as any);
  }, [data, node.id, onUpdate]);

  const removeKeyValue = useCallback((field: "metadata" | "customFields", index: number) => {
    const current = [...(data as any)[field]];
    current.splice(index, 1);
    onUpdate(node.id, { [field]: current } as any);
  }, [data, node.id, onUpdate]);

  // Helper to update any field
  const updateField = useCallback((field: string, value: any) => {
    onUpdate(node.id, { [field]: value } as any);
  }, [node.id, onUpdate]);

  const renderEditor = () => {
    switch (data.type) {
      case "start":
        const startData = data as StartNodeData;
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input 
                type="text" 
                value={startData.title} 
                onChange={(e) => updateField("title", e.target.value)} 
                className="w-full px-3 py-2 border rounded-md" 
                placeholder="Workflow start" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Metadata</label>
              {startData.metadata.map((item, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input 
                    type="text" 
                    value={item.key} 
                    onChange={(e) => updateKeyValue("metadata", idx, e.target.value, item.value)} 
                    className="flex-1 px-2 py-1 border rounded text-sm" 
                    placeholder="Key" 
                  />
                  <input 
                    type="text" 
                    value={item.value} 
                    onChange={(e) => updateKeyValue("metadata", idx, item.key, e.target.value)} 
                    className="flex-1 px-2 py-1 border rounded text-sm" 
                    placeholder="Value" 
                  />
                  <button 
                    onClick={() => removeKeyValue("metadata", idx)} 
                    className="text-red-500"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button 
                onClick={() => addKeyValue("metadata")} 
                className="text-sm text-blue-600 hover:underline"
              >
                + Add metadata
              </button>
            </div>
          </div>
        );

      case "task":
        const taskData = data as TaskNodeData;
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input 
                type="text" 
                value={taskData.title} 
                onChange={(e) => updateField("title", e.target.value)} 
                className="w-full px-3 py-2 border rounded-md" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={taskData.description} 
                onChange={(e) => updateField("description", e.target.value)} 
                className="w-full px-3 py-2 border rounded-md" 
                rows={3} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Assignee</label>
              <input 
                type="text" 
                value={taskData.assignee} 
                onChange={(e) => updateField("assignee", e.target.value)} 
                className="w-full px-3 py-2 border rounded-md" 
                placeholder="john@company.com" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Due Date</label>
              <input 
                type="date" 
                value={taskData.dueDate} 
                onChange={(e) => updateField("dueDate", e.target.value)} 
                className="w-full px-3 py-2 border rounded-md" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Custom Fields</label>
              {taskData.customFields.map((item, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input 
                    type="text" 
                    value={item.key} 
                    onChange={(e) => updateKeyValue("customFields", idx, e.target.value, item.value)} 
                    className="flex-1 px-2 py-1 border rounded text-sm" 
                    placeholder="Key" 
                  />
                  <input 
                    type="text" 
                    value={item.value} 
                    onChange={(e) => updateKeyValue("customFields", idx, item.key, e.target.value)} 
                    className="flex-1 px-2 py-1 border rounded text-sm" 
                    placeholder="Value" 
                  />
                  <button 
                    onClick={() => removeKeyValue("customFields", idx)} 
                    className="text-red-500"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button 
                onClick={() => addKeyValue("customFields")} 
                className="text-sm text-blue-600 hover:underline"
              >
                + Add field
              </button>
            </div>
          </div>
        );

      case "approval":
        const approvalData = data as ApprovalNodeData;
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input 
                type="text" 
                value={approvalData.title} 
                onChange={(e) => updateField("title", e.target.value)} 
                className="w-full px-3 py-2 border rounded-md" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Approver Role</label>
              <select 
                value={approvalData.approverRole} 
                onChange={(e) => updateField("approverRole", e.target.value)} 
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select role</option>
                <option value="Manager">Manager</option>
                <option value="HRBP">HRBP</option>
                <option value="Director">Director</option>
                <option value="VP">VP</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Auto-approve Threshold</label>
              <input 
                type="number" 
                value={approvalData.autoApproveThreshold} 
                onChange={(e) => updateField("autoApproveThreshold", parseInt(e.target.value || "0"))} 
                className="w-full px-3 py-2 border rounded-md" 
                placeholder="0" 
              />
            </div>
          </div>
        );

      case "automated":
        const automatedData = data as AutomatedNodeData;
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input 
                type="text" 
                value={automatedData.title} 
                onChange={(e) => updateField("title", e.target.value)} 
                className="w-full px-3 py-2 border rounded-md" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Action</label>
              <select 
                value={automatedData.actionId} 
                onChange={(e) => { 
                  updateField("actionId", e.target.value); 
                  updateField("parameters", {}); 
                }} 
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select action</option>
                {automations.map((action) => (
                  <option key={action.id} value={action.id}>
                    {action.label}
                  </option>
                ))}
              </select>
            </div>
            {automatedData.actionId && (
              <div>
                <label className="block text-sm font-medium mb-2">Parameters</label>
                {automations.find(a => a.id === automatedData.actionId)?.params.map((param) => (
                  <div key={param} className="mb-2">
                    <label className="block text-xs text-gray-600 mb-1">{param}</label>
                    <input 
                      type="text" 
                      value={automatedData.parameters[param] || ""} 
                      onChange={(e) => updateField("parameters", { 
                        ...automatedData.parameters, 
                        [param]: e.target.value 
                      })} 
                      className="w-full px-2 py-1 border rounded text-sm" 
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "end":
        const endData = data as EndNodeData;
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">End Message</label>
              <textarea 
                value={endData.endMessage} 
                onChange={(e) => updateField("endMessage", e.target.value)} 
                className="w-full px-3 py-2 border rounded-md" 
                rows={3} 
                placeholder="Workflow completed successfully" 
              />
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={endData.summaryFlag} 
                onChange={(e) => updateField("summaryFlag", e.target.checked)} 
                className="w-4 h-4" 
              />
              <label className="text-sm font-medium">Generate Summary</label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-gray-800">Edit Node</h3>
        <button 
          onClick={() => onDelete(node.id)} 
          className="p-2 text-red-600 hover:bg-red-50 rounded" 
          title="Delete node"
        >
          <Trash2 size={18} />
        </button>
      </div>
      {renderEditor()}
    </div>
  );
};

export default NodeEditor;