/*
  HRWorkflowDesigner.tsx
  - Full frontend React component (TypeScript + Tailwind) integrating with backend
  - Features:
    * React Flow canvas with Start/Task/Approval/Automated/End nodes
    * Node palette (add nodes)
    * Node editor forms (dynamic per node type)
    * Undo / Redo history
    * Import / Export JSON
    * Fetch automations from backend
    * Validate and simulate via backend endpoints
    * Keyboard shortcuts: Ctrl+Z (undo), Ctrl+Y or Ctrl+Shift+Z (redo)

  Notes:
  - Set REACT_APP_BACKEND_URL (CRA) or VITE_BACKEND_URL (Vite). This component will use REACT_APP_BACKEND_URL first then fallback to window.env
*/
