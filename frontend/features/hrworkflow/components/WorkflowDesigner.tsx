import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  addEdge,
  Edge,
  EdgeChange,
  MarkerType,
  Node,
  NodeChange,
  NodeTypes,
  Connection,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";

// Import from separate files
import SimulationPanel from "./SimulationPanel";
import NodePalette from "./NodePalette";
import NodeEditor from "./NodeEditor";
import CustomNode from "./CustomNode"; // Import CustomNode


import {
  ApprovalNodeData,
  AutomatedNodeData,
  AutomationAction,
  BaseNodeData,
  EndNodeData,
  NodeDataType,
  SimulationStep,
  StartNodeData,
  TaskNodeData,
  WorkflowNodeData,
} from "../types/workflow.types";
import Header from "./Header";
import WorkflowCanvas from "./WorkflowCanvas";
import {  fetchAutomationsService, simulateWorkflowService, validateWorkflowService } from "../services/workflow.service";

export default function HRWorkflowDesigner() {
  const [nodes, setNodes, onNodesChangeInternal] =
    useNodesState<WorkflowNodeData>([]);
  const [edges, setEdges, onEdgesChangeInternal] = useEdgesState([]);
  const [selectedNode, setSelectedNode] =
    useState<Node<WorkflowNodeData> | null>(null);

  const [automations, setAutomations] = useState<AutomationAction[]>([]);
  const [simulationOpen, setSimulationOpen] = useState(false);
  const [simulationSteps, setSimulationSteps] = useState<SimulationStep[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  const [history, setHistory] = useState<
    { nodes: Node<WorkflowNodeData>[]; edges: Edge[] }[]
  >([]);
  const [redoStack, setRedoStack] = useState<
    { nodes: Node<WorkflowNodeData>[]; edges: Edge[] }[]
  >([]);

  const canUndo = history.length > 0;
  const canRedo = redoStack.length > 0;

  const nodeTypes: NodeTypes = useMemo(
    () => ({
      custom: CustomNode as any,
    }),
    []
  );

  const fetchAutomations = useCallback(async () => {
  const result = await fetchAutomationsService();
  setAutomations(result);
}, []);

const validateWorkflowOnServer = useCallback(async (payload:{
    nodes: Node<WorkflowNodeData, string | undefined>[];
    edges: Edge<any>[];
}
) => {
  return await validateWorkflowService(payload);
}, []);

const simulateWorkflowOnServer = useCallback(async (payload:{
    nodes: Node<WorkflowNodeData, string | undefined>[];
    edges: Edge<any>[];
}
) => {
  return await simulateWorkflowService(payload);
}, []);

  const pushToHistory = useCallback(() => {
    setHistory((prev) => [...prev, { nodes, edges }]);
    setRedoStack([]);
  }, [nodes, edges]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const hasNonSelectionChange = changes.some((c) => c.type !== "select");
      if (hasNonSelectionChange) pushToHistory();
      onNodesChangeInternal(changes);
    },
    [onNodesChangeInternal, pushToHistory]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      const hasNonSelectionChange = changes.some((c) => c.type !== "select");
      if (hasNonSelectionChange) pushToHistory();
      onEdgesChangeInternal(changes);
    },
    [onEdgesChangeInternal, pushToHistory]
  );

  const onConnect = useCallback(
    (params: Connection) => {
      const sourceNode = nodes.find((n) => n.id === params.source);
      const targetNode = nodes.find((n) => n.id === params.target);
      if (
        targetNode?.data.type === "start" ||
        sourceNode?.data.type === "end"
      ) {
        alert(
          "Invalid connection: Cannot connect to Start nodes or from End nodes"
        );
        return;
      }
      pushToHistory();
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: "smoothstep",
            animated: true,
            markerEnd: { type: MarkerType.ArrowClosed },
          },
          eds
        )
      );
    },
    [nodes, pushToHistory, setEdges]
  );

  const onAddNode = useCallback(
    (type: NodeDataType) => {
      pushToHistory();
      const id = `${type}-${Date.now()}`;
      const position = {
        x: Math.random() * 400 + 100,
        y: Math.random() * 300 + 100,
      };
      const baseData: BaseNodeData = {
        label: type.charAt(0).toUpperCase() + type.slice(1),
        type,
        isValid: false,
      };

      let data: WorkflowNodeData;
      switch (type) {
        case "start":
          data = {
            ...baseData,
            type: "start",
            title: "Start",
            metadata: [],
          } as StartNodeData;
          break;
        case "task":
          data = {
            ...baseData,
            type: "task",
            title: "",
            description: "",
            assignee: "",
            dueDate: "",
            customFields: [],
          } as TaskNodeData;
          break;
        case "approval":
          data = {
            ...baseData,
            type: "approval",
            title: "",
            approverRole: "",
            autoApproveThreshold: 0,
          } as ApprovalNodeData;
          break;
        case "automated":
          data = {
            ...baseData,
            type: "automated",
            title: "",
            actionId: "",
            parameters: {},
          } as AutomatedNodeData;
          break;
        case "end":
          data = {
            ...baseData,
            type: "end",
            endMessage: "",
            summaryFlag: false,
          } as EndNodeData;
          break;
      }

      const newNode: Node<WorkflowNodeData> = {
        id,
        type: "custom", // This MUST match the key in nodeTypes object
        position,
        data,
      };
      setNodes((nds) => [...nds, newNode]);
    },
    [pushToHistory, setNodes]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node<WorkflowNodeData>) =>
      setSelectedNode(node),
    []
  );

  const updateNodeData = useCallback(
    (id: string, newData: Partial<WorkflowNodeData>) => {
      pushToHistory();
      setNodes((nds) =>
        nds.map((node) =>
          node.id === id
            ? {
                ...node,
                data: { ...node.data, ...newData } as WorkflowNodeData,
              }
            : node
        )
      );
      if (selectedNode?.id === id) {
        setSelectedNode((prev) =>
          prev
            ? {
                ...prev,
                data: { ...prev.data, ...newData } as WorkflowNodeData,
              }
            : null
        );
      }
    },
    [pushToHistory, setNodes, selectedNode]
  );

  const deleteNode = useCallback(
    (id: string) => {
      pushToHistory();
      setNodes((nds) => nds.filter((n) => n.id !== id));
      setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
      if (selectedNode?.id === id) setSelectedNode(null);
    },
    [pushToHistory, setNodes, setEdges, selectedNode]
  );

  const runSimulation = async () => {
    const payload = { nodes, edges };
    setIsSimulating(true);
    setSimulationOpen(true);
    setSimulationSteps([]);
    try {
      await validateWorkflowOnServer(payload);
      const result = await simulateWorkflowOnServer(payload);
      setSimulationSteps(result.steps || []);
    } catch (err: any) {
      alert(err.message || "Simulation failed");
      setSimulationSteps([]);
    } finally {
      setIsSimulating(false);
    }
  };

  const exportWorkflow = () => {
    const workflow = { nodes, edges };
    const blob = new Blob([JSON.stringify(workflow, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "workflow.json";
    a.click();
  };

  const importWorkflow = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const workflow = JSON.parse(event.target?.result as string);
        pushToHistory();
        setNodes(workflow.nodes || []);
        setEdges(workflow.edges || []);
        setSelectedNode(null);
      } catch (error) {
        alert("Invalid workflow file");
      }
    };
    reader.readAsText(file);
  };

  const undo = useCallback(() => {
    if (!canUndo || history.length === 0) return;

    const lastState = history[history.length - 1];
    setRedoStack((r) => [...r, { nodes, edges }]);
    setNodes(lastState.nodes);
    setEdges(lastState.edges);
    setHistory((prev) => prev.slice(0, prev.length - 1));
    setSelectedNode(null);
  }, [canUndo, history, nodes, edges, setNodes, setEdges]);

  const redo = useCallback(() => {
    if (!canRedo || redoStack.length === 0) return;

    const nextState = redoStack[redoStack.length - 1];
    setHistory((h) => [...h, { nodes, edges }]);
    setNodes(nextState.nodes);
    setEdges(nextState.edges);
    setRedoStack((prev) => prev.slice(0, prev.length - 1));
    setSelectedNode(null);
  }, [canRedo, redoStack, nodes, edges, setNodes, setEdges]);

  useEffect(() => {
    fetchAutomations();
  }, [fetchAutomations]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "y" || (e.key === "z" && e.shiftKey))
      ) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo]);

  return (
    <div className="h-screen flex flex-col">
      <Header
        undo={undo}
        redo={redo}
        canRedo={canRedo}
        canUndo={canUndo}
        importWorkflow={importWorkflow}
        exportWorkflow={exportWorkflow}
        runSimulation={runSimulation}
      />

      <div className="flex-1 flex">
        <NodePalette onAddNode={onAddNode} />

        <WorkflowCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
        />

        <NodeEditor
          node={selectedNode}
          onUpdate={updateNodeData}
          onDelete={deleteNode}
          automations={automations}
        />
      </div>

      <SimulationPanel
        isOpen={simulationOpen}
        onClose={() => setSimulationOpen(false)}
        steps={simulationSteps}
        isRunning={isSimulating}
      />
    </div>
  );
}
