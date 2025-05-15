import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, ChevronDown, ChevronUp } from "lucide-react";

const InfoPanel: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-6">
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        <div className="flex items-center">
          <AlertCircle size={18} className="text-blue-400 mr-2" />
          <h3 className="text-lg font-medium text-white">How it works</h3>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isExpanded ? (
            <ChevronUp className="text-white" />
          ) : (
            <ChevronDown className="text-white" />
          )}
        </motion.div>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="expand-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-gray-700 text-gray-200">
              <p className="mb-2">
                This visualizer demonstrates a robot using the Breadth-First
                Search (BFS) algorithm to find a path from start (S) to goal (G)
                in an environment with unknown obstacles.
              </p>

              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>
                  Click on grid cells to place obstacles (avoid start/goal)
                </li>
                <li>
                  Press{" "}
                  <span className="font-semibold text-green-400">Start</span> to
                  begin pathfinding
                </li>
                <li>The robot starts at position (0,0) and must reach (4,4)</li>
                <li>Robot doesn't know obstacle positions in advance</li>
                <li>Replans with BFS when obstacles are detected</li>
                <li>Purple = visited, Blue = current path</li>
              </ul>

              <div className="mt-3 text-xs text-gray-400">
                <p>
                  Note: This simulates a real-world challenge where the robot
                  learns the environment while navigating.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InfoPanel;
