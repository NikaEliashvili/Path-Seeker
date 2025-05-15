import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Grid from "./components/Grid";
import Robot from "./components/Robot";
import ControlPanel from "./components/ControlPanel";
import InfoPanel from "./components/InfoPanel";
import { PathfindingService } from "./services/PathfindingService";
import {
  GRID_SIZE,
  START_POSITION,
  GOAL_POSITION,
  CELL_SIZE,
  CELL_COLORS,
} from "./constants";
import {
  CellType,
  Cell,
  GridState,
  Position,
  RobotState,
  PathfindingState,
} from "./types";
import { posToStr, arePositionsEqual } from "./utils";
import { RobotSVG } from "./components/RobotSVG";

function App() {
  // Initialize grid
  const [grid, setGrid] = useState<GridState>(() => {
    const initialGrid: GridState = [];
    for (let row = 0; row < GRID_SIZE; row++) {
      const gridRow: Cell[] = [];
      for (let col = 0; col < GRID_SIZE; col++) {
        const position: Position = [row, col];
        let type = CellType.EMPTY;

        if (arePositionsEqual(position, START_POSITION)) {
          type = CellType.START;
        } else if (arePositionsEqual(position, GOAL_POSITION)) {
          type = CellType.GOAL;
        }

        gridRow.push({ position, type });
      }
      initialGrid.push(gridRow);
    }
    return initialGrid;
  });

  // Track obstacles
  const [obstacles, setObstacles] = useState<Set<string>>(new Set());

  // Robot state
  const [robotState, setRobotState] = useState<RobotState>({
    position: START_POSITION,
    isMoving: false,
    hasReachedGoal: false,
  });

  // Pathfinding state
  const [pathfindingState, setPathfindingState] = useState<PathfindingState>({
    isRunning: false,
    currentPath: [],
    visitedCells: new Set(),
    knownObstacles: new Set(),
    status: "IDLE",
  });

  // Initialize pathfinding service
  const [pathfindingService, setPathfindingService] =
    useState<PathfindingService | null>(null);

  // Set up pathfinding service
  useEffect(() => {
    const service = new PathfindingService(
      obstacles,
      (newState) => setPathfindingState(newState),
      (newPosition) => {
        setRobotState((prev) => ({
          ...prev,
          position: newPosition,
          isMoving: true,
          hasReachedGoal: arePositionsEqual(newPosition, GOAL_POSITION),
        }));

        // Reset isMoving after animation completes
        setTimeout(() => {
          setRobotState((prev) => ({
            ...prev,
            isMoving: false,
          }));
        }, 500);
      }
    );

    setPathfindingService(service);
  }, [obstacles]);

  useEffect(() => {
    let timerId = undefined;
    if (robotState.hasReachedGoal) {
      timerId = setTimeout(() => {
        // Reset robot to start position
        setRobotState((prev) => ({ ...prev, hasReachedGoal: false }));
      }, 5000);
    }
    return () => {
      clearTimeout(timerId);
    };
  }, [robotState]);

  // Handle cell click to toggle obstacles
  const handleCellClick = useCallback(
    (position: Position) => {
      if (pathfindingState.isRunning) return;
      const posKey = posToStr(position);

      // Don't allow placing obstacles on start or goal
      if (
        arePositionsEqual(position, START_POSITION) ||
        arePositionsEqual(position, GOAL_POSITION)
      ) {
        return;
      }

      setGrid((prevGrid) => {
        const newGrid = prevGrid.map((row) => [...row]);
        const cell = newGrid[position[0]][position[1]];

        // Toggle obstacle
        const newType =
          cell.type === CellType.OBSTACLE ? CellType.EMPTY : CellType.OBSTACLE;

        newGrid[position[0]][position[1]] = {
          ...cell,
          type: newType,
        };

        return newGrid;
      });

      setObstacles((prevObstacles) => {
        const newObstacles = new Set(prevObstacles);

        if (newObstacles.has(posKey)) {
          newObstacles.delete(posKey);
        } else {
          newObstacles.add(posKey);
        }

        return newObstacles;
      });
    },
    [pathfindingState.isRunning]
  );

  // Start pathfinding
  const handleStart = useCallback(() => {
    if (
      !pathfindingService ||
      pathfindingState.isRunning ||
      obstacles.size === 0
    )
      return;

    // Reset robot to start position
    setRobotState({
      position: START_POSITION,
      isMoving: false,
      hasReachedGoal: false,
    });

    pathfindingService.startPathfinding();
  }, [pathfindingService, pathfindingState.isRunning, obstacles.size]);

  // Reset everything
  const handleReset = useCallback(() => {
    setPathfindingState({
      isRunning: false,
      currentPath: [],
      visitedCells: new Set(),
      knownObstacles: new Set(),
      status: "IDLE",
    });

    setRobotState({
      position: START_POSITION,
      isMoving: false,
      hasReachedGoal: false,
    });

    // Clear obstacles
    setObstacles(new Set());
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((grid) => [...grid]);
      for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
          const position: Position = [row, col];
          if (
            !arePositionsEqual(position, START_POSITION) &&
            !arePositionsEqual(position, GOAL_POSITION)
          ) {
            newGrid[row][col].type = CellType.EMPTY;
          }
        }
      }
      return newGrid;
    });
    if (pathfindingService) {
      pathfindingService.reset();
    }
  }, [pathfindingService]);

  return (
    <div
      className={`min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 `}
    >
      <motion.div
        className="max-w-4xl w-full mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="text-3xl font-bold text-white text-center mb-2"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Robot Pathfinding Visualizer
        </motion.h1>

        <motion.p
          className="text-gray-400 text-center mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Watch a robot navigate through unknown obstacles using BFS algorithm
        </motion.p>

        <InfoPanel />

        <div className="flex flex-col lg:flex-row gap-6">
          <div
            className={`relative ${
              pathfindingState.status === "NO_PATH"
                ? "opacity-60 cursor-default pointer-events-none"
                : ""
            }`}
          >
            <Grid
              grid={grid}
              onCellClick={handleCellClick}
              currentPath={pathfindingState.currentPath}
              visitedCells={pathfindingState.visitedCells}
              isPathfinding={pathfindingState.isRunning}
            />

            <div
              className="absolute top-0 left-0 pointer-events-none"
              style={{
                width: `${GRID_SIZE * CELL_SIZE + (GRID_SIZE - 1) * 4 + 16}px`,
                height: `${GRID_SIZE * CELL_SIZE + (GRID_SIZE - 1) * 4 + 16}px`,
              }}
            >
              <Robot
                position={robotState.position}
                isMoving={robotState.isMoving}
                hasReachedGoal={robotState.hasReachedGoal}
              />
            </div>
          </div>

          <div className="flex-1">
            <ControlPanel
              onStart={handleStart}
              onReset={handleReset}
              isRunning={pathfindingState.isRunning}
              status={pathfindingState.status}
              canStart={obstacles.size > 0}
            />

            {!pathfindingState.isRunning &&
              pathfindingState.status === "GOAL_REACHED" && (
                <div className="mt-6 bg-gray-800 p-4 rounded-lg shadow-lg text-white/70 font-mono font-semibold text-lg">
                  <p>
                    Robot used:{" "}
                    <span className="text-white">
                      {" "}
                      {pathfindingState.currentPath.length} steps{" "}
                    </span>
                  </p>
                  <p className="flex-nowrap inline">Every Step:</p>
                  <p className="inline ml-2">
                    {pathfindingState.currentPath.map((pos, indx) => (
                      <span className="text-base text-white">
                        ({pos[0]},{pos[1]})
                        {indx !== pathfindingState.currentPath.length - 1 &&
                          "; "}
                      </span>
                    ))}
                  </p>
                </div>
              )}

            <div className="mt-6 bg-gray-800 p-4 rounded-lg shadow-lg">
              <h3 className="text-lg font-medium text-white mb-2">Legend</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center">
                  <div
                    className={`${
                      CELL_COLORS[CellType.START]
                    } w-4 h-4 rounded-sm mr-2`}
                  ></div>
                  <span className="text-sm text-white">Start (0,0)</span>
                </div>
                <div className="flex items-center">
                  <div
                    className={`${
                      CELL_COLORS[CellType.GOAL]
                    } w-4 h-4 rounded-sm mr-2`}
                  ></div>
                  <span className="text-sm text-white">Goal (4,4)</span>
                </div>
                <div className="flex items-center">
                  <div
                    className={`${
                      CELL_COLORS[CellType.OBSTACLE]
                    } w-4 h-4 rounded-sm mr-2`}
                  ></div>
                  <span className="text-sm text-white">Obstacle</span>
                </div>
                <div className="flex items-center">
                  <div
                    className={`${
                      CELL_COLORS[CellType.VISITED]
                    } w-4 h-4 rounded-sm mr-2`}
                  ></div>
                  <span className="text-sm text-white">Visited</span>
                </div>
                <div className="flex items-center">
                  <div
                    className={`${CELL_COLORS["path"]} w-4 h-4 rounded-sm mr-2`}
                  ></div>
                  <span className="text-sm text-white">Planned Path</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 flex items-center justify-center bg-transparent mr-2">
                    <span className="text-yellow-400 text-xs scale-[0.35]">
                      <RobotSVG />
                    </span>
                  </div>
                  <span className="text-sm text-white">Robot</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default App;
