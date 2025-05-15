import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

const InfoPanel: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div 
      className="bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      layout
    >
      <motion.div 
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <AlertCircle size={18} className="text-blue-400 mr-2" />
          <h3 className="text-lg font-medium text-white">How it works</h3>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isExpanded ? <ChevronUp className="text-white" /> : <ChevronDown className="text-white" />}
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            className="p-4 bg-gray-700 text-gray-200"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="mb-2">This visualizer demonstrates a robot using the Breadth-First Search (BFS) algorithm to find a path from start (S) to goal (G) in an environment with unknown obstacles.</p>
            
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Click on grid cells to place obstacles (avoid start and goal positions)</li>
              <li>Press <span className="font-semibold text-green-400">Start</span> to begin the pathfinding process</li>
              <li>The robot starts at position (0,0) and must reach (4,4)</li>
              <li>Robot doesn't know obstacle positions in advance</li>
              <li>When an obstacle is detected, the robot replans its path using BFS</li>
              <li>Purple cells show visited areas, blue cells show the current planned path</li>
            </ul>
            
            <div className="mt-3 text-xs text-gray-400">
              <p>Note: This is a simplified demonstration of real-world robot navigation challenges where complete environment knowledge isn't available in advance.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default InfoPanel;