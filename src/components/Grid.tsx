import React from "react";
import { motion } from "framer-motion";
import Cell from "./Cell";
import { GridState, Position } from "../types";
import { CELL_SIZE } from "../constants";
import { posToStr } from "../utils";

interface GridProps {
  grid: GridState;
  onCellClick: (position: Position) => void;
  currentPath: Position[];
  visitedCells: Set<string>;
  isPathfinding: boolean;
}

const Grid: React.FC<GridProps> = ({
  grid,
  onCellClick,
  currentPath,
  visitedCells,
  isPathfinding,
}) => {
  // Convert current path to a set for easy lookup
  const pathCells = new Set<string>(currentPath.map(posToStr));

  return (
    <motion.div
      className="relative grid gap-1 bg-gray-800 p-2 rounded-lg shadow-xl"
      style={{
        gridTemplateColumns: `repeat(${grid[0].length}, ${CELL_SIZE}px)`,
        gridTemplateRows: `repeat(${grid.length}, ${CELL_SIZE}px)`,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            cell={cell}
            onClick={onCellClick}
            showOverlay={isPathfinding}
            isPartOfPath={pathCells.has(posToStr(cell.position))}
            isVisited={visitedCells.has(posToStr(cell.position))}
          />
        ))
      )}
    </motion.div>
  );
};

export default Grid;
