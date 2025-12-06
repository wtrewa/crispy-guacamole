import { NODE_TYPE_CONFIGS } from "../constants/workflow.contants";
import { NodeDataType } from "../types/workflow.types";

const NodePalette: React.FC<{ onAddNode: (type: NodeDataType) => void }> = ({ onAddNode }) => {
  const nodeTypes: { type: NodeDataType; label: string; icon: string; desc?: string }[] = NODE_TYPE_CONFIGS;

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
      <h3 className="font-bold text-lg mb-2 text-gray-800">Node Types</h3>
      <p className="text-xs text-gray-500 mb-4">Click to add nodes to canvas</p>
      <div className="space-y-2">
        {nodeTypes.map((n) => (
          <button key={n.type} onClick={() => onAddNode(n.type)} className="w-full p-3 rounded-lg border border-gray-300 bg-white text-left hover:bg-gray-50">
            <div className="flex items-center gap-2">
              <span className="text-xl">{n.icon}</span>
              <div className="flex-1">
                <span className="font-medium text-sm block">{n.label}</span>
                <span className="text-xs text-gray-600">{n.desc}</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-sm text-blue-900 mb-2">💡 How to Connect</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Drag from the <strong>blue dot</strong> at the bottom of a node</li>
          <li>• Drop on the <strong>gray dot</strong> at the top of another node</li>
          <li>• Click an edge and press <strong>Delete</strong> to remove it</li>
        </ul>
      </div>
    </div>
  );
};
export default NodePalette;