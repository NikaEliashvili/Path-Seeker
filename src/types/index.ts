export type Position = [number, number];

export enum CellType {
  EMPTY = 'empty',
  START = 'start',
  GOAL = 'goal',
  OBSTACLE = 'obstacle',
  PATH = 'path',
  VISITED = 'visited',
  ROBOT = 'robot'
}

export type Cell = {
  position: Position;
  type: CellType;
};

export type GridState = Cell[][];

export type RobotState = {
  position: Position;
  isMoving: boolean;
  hasReachedGoal: boolean;
};

export type PathfindingState = {
  isRunning: boolean;
  currentPath: Position[];
  visitedCells: Set<string>;
  knownObstacles: Set<string>;
  status: string;
};