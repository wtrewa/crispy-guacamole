import { Download, Play, Upload } from "lucide-react";


// Header.tsx (SRP)
interface HeaderProps {
  undo: () => void;
  redo: () => void;
  runSimulation: () => void;
  exportWorkflow: () => void;
  importWorkflow: (e: React.ChangeEvent<HTMLInputElement>) => void;
  canUndo: boolean;
  canRedo: boolean;
}

const Header: React.FC<HeaderProps> = ({
  undo,
  canUndo,
  redo,
  canRedo,
  runSimulation,
  exportWorkflow,
  importWorkflow,

}) => (
    <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            HR Workflow Designer
          </h1>
          <p className="text-sm text-gray-500">
            Drag nodes, connect them, and build your workflow
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <button
            onClick={undo}
            disabled={!canUndo}
            className={`px-3 py-2 rounded-lg text-sm ${
              canUndo
                ? "bg-gray-500 text-white hover:bg-gray-600"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Undo
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className={`px-3 py-2 rounded-lg text-sm ${
              canRedo
                ? "bg-gray-500 text-white hover:bg-gray-600"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Redo
          </button>

          <button
            onClick={runSimulation}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Play size={18} /> Run Simulation
          </button>

          <button
            onClick={exportWorkflow}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
          >
            <Download size={18} /> Export
          </button>

          <label className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2 cursor-pointer">
            <Upload size={18} /> Import{" "}
            <input
              type="file"
              accept=".json"
              onChange={importWorkflow}
              className="hidden"
            />
          </label>
        </div>
      </header>
);


export default Header;