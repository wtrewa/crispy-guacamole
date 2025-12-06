import { CheckCircle2 } from "lucide-react";
import { SimulationStep } from "../../types/workflow.types";


const SimulationPanel: React.FC<{ isOpen: boolean; onClose: () => void; steps: SimulationStep[]; isRunning: boolean }> = ({ isOpen, onClose, steps, isRunning }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-2/3 max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Workflow Simulation</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
        </div>
        <div className="p-4 overflow-y-auto flex-1">
          {isRunning && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Running simulation...</p>
            </div>
          )}

          {!isRunning && steps.length > 0 && (
            <div className="space-y-3">
              {steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <CheckCircle2 className="text-green-500 mt-1" size={20} />
                  <div className="flex-1">
                    <p className="font-medium">{step.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(step.timestamp).toLocaleTimeString()}</p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">{step.status}</span>
                </div>
              ))}
            </div>
          )}

          {!isRunning && steps.length === 0 && (
            <p className="text-center text-gray-500 py-8">No simulation results yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimulationPanel;