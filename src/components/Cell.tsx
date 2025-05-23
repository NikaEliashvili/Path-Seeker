import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cell as CellType, CellType as CellTypeEnum, Position } from "../types";
import { CELL_COLORS, START_POSITION, GOAL_POSITION } from "../constants";
import { arePositionsEqual } from "../utils";

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
  isVisited,
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
      className={`relative w-full h-full border border-gray-800 rounded-md cursor-pointer ${cellClass} duration-200 hover:brightness-90 transition-all`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
      }}
      transition={{ duration: 0.3 }}
      onClick={handleClick}
      layout
    >
      {isStart && (
        <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
          Start
        </div>
      )}
      {isGoal && (
        <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
          Goal
        </div>
      )}
      {showOverlay && !isStart && !isGoal && type !== CellTypeEnum.OBSTACLE && (
        <motion.div
          className="absolute inset-0 bg-white/10 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 0.2 }}
        />
      )}
      <AnimatePresence>
        {type === CellTypeEnum.OBSTACLE && (
          <motion.div
            className={`absolute inset-0 rounded-md overflow-hidden ${CELL_COLORS[type]}`}
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            <div className={`absolute inset-0 z-10`}></div>
            <img src="/danger.jpg" className="opacity-50 brightness-50" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Cell;
