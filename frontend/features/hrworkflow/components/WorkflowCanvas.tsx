import ReactFlow, { Background, ConnectionLineType, Controls, Edge, MiniMap, Node, NodeTypes, OnConnect, OnEdgesChange, OnNodesChange } from "reactflow";
import { NodeDataType, WorkflowNodeData } from "../types/workflow.types";
import { MINIMAP_COLORS } from "../constants/workflow.contants";


interface WorkflowCanvasProps {
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  onNodeClick: any;
  nodeTypes: NodeTypes;
}

const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  nodeTypes
}) => (
  <div className="flex-1">
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeClick={onNodeClick}
      nodeTypes={nodeTypes}
      connectionLineType={ConnectionLineType.SmoothStep}
      defaultEdgeOptions={{
        type: "smoothstep",
        animated: true,
        style: { stroke: "#3b82f6", strokeWidth: 2 },
      }}
      fitView
    >
      <Background color="#e5e7eb" gap={16} />
      <Controls />
      <MiniMap
        nodeColor={(node) => {
          const colors: Record<NodeDataType, string> = MINIMAP_COLORS;
          return colors[(node.data as WorkflowNodeData).type] || "#e5e7eb";
        }}
        maskColor="rgba(0,0,0,0.1)"
        style={{ background: "#f9fafb" }}
      />
    </ReactFlow>
  </div>
);

export default WorkflowCanvas;