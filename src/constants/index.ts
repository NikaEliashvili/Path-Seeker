import { CellType } from '../types';

export const GRID_SIZE = 5;

export const START_POSITION: [number, number] = [0, 0];
export const GOAL_POSITION: [number, number] = [4, 4];

export const CELL_SIZE = 70;
export const ROBOT_SIZE = 40;

export const MOVE_ANIMATION_DURATION = 0.5;
export const PATH_ANIMATION_DELAY = 0.1;

export const CELL_COLORS = {
  [CellType.EMPTY]: 'bg-gray-700',
  [CellType.START]: 'bg-green-600',
  [CellType.GOAL]: 'bg-red-600',
  [CellType.OBSTACLE]: 'bg-slate-900',
  [CellType.PATH]: 'bg-blue-500',
  [CellType.VISITED]: 'bg-purple-500 opacity-40',
  [CellType.ROBOT]: 'bg-yellow-400'
};

export const DIRECTIONS: [number, number][] = [
  [0, 1], // right
  [1, 0], // down
  [0, -1], // left
  [-1, 0], // up
];

export const STATUS_MESSAGES = {
  IDLE: 'Click on cells to place obstacles, then press Start to begin pathfinding',
  RUNNING: 'Robot is pathfinding...',
  PLANNING: 'Planning path...',
  MOVING: 'Moving robot...',
  OBSTACLE_DETECTED: 'Obstacle detected! Replanning...',
  GOAL_REACHED: 'Goal reached! 🎉',
  NO_PATH: 'No path found to goal!'
};