1. High-Level Architecture

The project follows a feature-based architecture combined with SOLID principles, ensuring high scalability, modularity, and maintainability.
The system is structured into three main layers:

Presentation Layer (React + React Flow)

Workflow canvas

Node components

Node configuration forms

Sandbox panel

State handling via hooks

Application Layer

Services for API interaction

Custom React hooks

Shared utilities for workflow serialization & validation

Mock Backend Layer (Node Server / MSW)

Exposes endpoints like /automations and /simulate

Handles workflow simulation logic

Provides mock action metadata for Automated Nodes

This separation ensures clarity, testability, and loose coupling between UI, logic, and data.

✅ 2. Folder Structure (Feature-Based + Scalable)

The project uses a feature-based folder structure, meaning everything related to a single feature lives together. This improves maintainability as the app grows.

src/
├─ features/
│  └─ workflow/
│     ├─ components/
│     │  ├─ FlowCanvas/
│     │  │  ├─ FlowCanvas.tsx
│     │  │  ├─ nodes/
│     │  │  │  ├─ StartNode.tsx
│     │  │  │  ├─ TaskNode.tsx
│     │  │  │  ├─ ApprovalNode.tsx
│     │  │  │  ├─ AutomatedNode.tsx
│     │  │  │  └─ EndNode.tsx
│     │  │  └─ NodeFormPanel.tsx
│     │  ├─ SandboxPanel.tsx
│     ├─ services/
│     │  └─ workflowService.ts
│     ├─ hooks/
│     │  └─ useWorkflowSimulate.ts
│     ├─ utils/
│     │  └─ graph.ts
│     └─ types/
│        └─ workflow.ts
│
├─ api/
│  └─ msw/
│     ├─ handlers.ts
│     └─ browser.ts
│
├─ app/
│  └─ App.tsx
│
└─ main.tsx

✅ 3. Why Feature-Based Architecture?

Feature-based architecture organizes the project by functional domains rather than technical folders.

🔹 Benefits:

Easier to find everything related to a feature (nodes, forms, types, services)

Highly scalable as new node types and workflows are added

Reduces complexity in large codebases

Enables teams to work independently on features

Prevents “god folders” like components/ or utils/

This is commonly used in:

Large-scale React apps

Enterprise workflow builders

Low-code system architectures

✅ 4. SOLID Principles Applied

Even though this is a front-end project, architecture respects SOLID principles:

S — Single Responsibility Principle

Every module has one responsibility:

workflowService.ts → API wrapper only

NodeFormPanel.tsx → node editing UI

Each custom node component → defines only visuals & connectors

graph.ts → serialization logic

O — Open/Closed Principle

New node types can be added without modifying core logic.
React Flow nodeTypes handles this extension cleanly.

L — Liskov Substitution Principle

All node types share the base WorkflowNodeData interface → interchangeable for core logic.

I — Interface Segregation Principle

Each node has its own narrow interface:

StartNodeData

TaskNodeData

ApprovalNodeData

etc.

No large, bloated type.

D — Dependency Inversion Principle

UI components depend on abstracted services (API layer), not direct fetch calls.

✅ 5. Backend Architecture (Node Server / MSW)

Although the final product runs in the browser, a mock Node backend is used via MSW or Node-powered simulation.

Backend Responsibilities:

Serve automation metadata (GET /automations)

Run workflow simulation (POST /simulate)

Validate workflow graph

Provide dynamic parameters for automated nodes

Why Mock Backend?

Allows fully isolated FE testing

Eliminates backend dependency

Simulates real-world HR workflow systems

Enables rapid prototyping within the time box

✅ 6. Workflow Simulation Architecture

The /simulate endpoint performs:

Workflow graph serialization

Node mapping (ID → Node object)

Edge adjacency list creation

BFS traversal to determine execution sequence

Generate a step-by-step execution log

This design reflects real workflow engines like:

Camunda

Airflow

Temporal

✅ 7. Component Architecture
Canvas Layer

Responsible for:

Rendering nodes

Edge handling

Node selection

Drag/drop behaviors

Node Components Layer

Each node:

Has isolated visuals

Uses only data passed by React Flow

Has handles for connecting edges

NodeFormPanel

Input validation

Controlled components

Updates node data immutably

Sandbox Panel

Sends workflow to backend

Displays execution logs

Useful for debugging

✅ 8. State Management Strategy

Used:

useNodesState and useEdgesState from React Flow

Local component state for forms

No external heavy state (Redux/Zustand) to keep project simple

This ensures:

Performance

Predictable node updates

Minimal re-rendering

✅ 9. Why This Architecture Works
✔ Scalable

Adding a new node type requires:

A new component

A new config schema

Register in nodeTypes

No breaking changes.

✔ Testable

Business logic isolated in:

services

hooks

utils

✔ Extensible

Can support:

Permissions

Multi-level approvals

Auto-layout

Workflow versioning

✔ Clean separation between UI → Logic → Data

Following a true layered architecture.