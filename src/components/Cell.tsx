import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cell as CellType, CellType as CellTypeEnum, Position } from '../types';
import { CELL_COLORS, START_POSITION, GOAL_POSITION } from '../constants';
import { arePositionsEqual } from '../utils';

interface CellProps {
  cell: CellType;
  onClick: (position: Position) => void;
  showOverlay: boolean;
  isPartOfPath: boolean;
  isVisited: boolean;
}

const Cell: React.FC<CellProps> = ({ 
  cell, 
  onClick, 
  showOverlay, 
  isPartOfPath, 
  isVisited 
}) => {
  const { position, type } = cell;
  
  const isStart = arePositionsEqual(position, START_POSITION);
  const isGoal = arePositionsEqual(position, GOAL_POSITION);
  
  // Determine cell appearance
  let cellClass = CELL_COLORS[type];
  if (isVisited && !isStart && !isGoal && type !== CellTypeEnum.OBSTACLE) {
    cellClass = CELL_COLORS[CellTypeEnum.VISITED];
  }
  if (isPartOfPath && !isStart && !isGoal && type !== CellTypeEnum.OBSTACLE) {
    cellClass = CELL_COLORS[CellTypeEnum.PATH];
  }

  const handleClick = () => {
    // Prevent clicking on start or goal positions
    if (!isStart && !isGoal) {
      onClick(position);
    }
  };

  return (
    <motion.div
      className={`relative w-full h-full border border-gray-800 rounded-md cursor-pointer ${cellClass} transition-colors duration-200`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
      }}
      transition={{ duration: 0.3 }}
      onClick={handleClick}
      whileHover={!isStart && !isGoal ? { scale: 0.95, backgroundColor: type === CellTypeEnum.EMPTY ? 'rgb(55 65 81)' : undefined } : undefined}
      layout
    >
      {isStart && (
        <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
          S
        </div>
      )}
      {isGoal && (
        <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
          G
        </div>
      )}
      <AnimatePresence>
        {type === CellTypeEnum.OBSTACLE && (
          <motion.div 
            className="absolute inset-0 bg-slate-900 rounded-md"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.5 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>
      {showOverlay && !isStart && !isGoal && type !== CellTypeEnum.OBSTACLE && (
        <motion.div 
          className="absolute inset-0 bg-white/10 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.div>
  );
};

export default Cell;