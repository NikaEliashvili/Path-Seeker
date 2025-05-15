import React from "react";
import { motion } from "framer-motion";
import { Play, RefreshCw, Info } from "lucide-react";
import { STATUS_MESSAGES } from "../constants";

interface ControlPanelProps {
  onStart: () => void;
  onReset: () => void;
  isRunning: boolean;
  status: string;
  canStart: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  onStart,
  onReset,
  isRunning,
  status,
  canStart,
}) => {
  // Get the appropriate status message
  const statusMessage =
    STATUS_MESSAGES[status as keyof typeof STATUS_MESSAGES] || status;

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
    disabled: { opacity: 0.9, scale: 1 },
  };

  return (
    <motion.div
      className="flex flex-col gap-4 bg-gray-800 p-4 rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center justify-between gap-4">
        <motion.button
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-green-600 text-white font-medium ${
            !canStart || isRunning
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-green-700"
          }`}
          onClick={onStart}
          disabled={!canStart || isRunning}
          variants={buttonVariants}
        >
          <Play size={16} />
          Start
        </motion.button>

        <motion.button
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700"
          onClick={onReset}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <RefreshCw size={16} />
          Reset
        </motion.button>
      </div>

      <motion.div
        className="flex items-center bg-gray-700 p-3 rounded-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        layout
      >
        <Info size={16} className="text-blue-400 mr-2 flex-shrink-0" />
        <p className="text-sm text-white">
          {!canStart ? "Place some obstacles to begin" : statusMessage}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default ControlPanel;
