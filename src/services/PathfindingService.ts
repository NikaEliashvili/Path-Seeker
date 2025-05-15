import { Position, PathfindingState } from "../types";
import { DIRECTIONS, START_POSITION, GOAL_POSITION } from "../constants";
import { posToStr, isValidPosition, sleep } from "../utils";

export class PathfindingService {
  private obstacles: Set<string> = new Set();
  private state: PathfindingState = {
    isRunning: false,
    currentPath: [],
    visitedCells: new Set(),
    knownObstacles: new Set(),
    status: "IDLE",
  };
  private onStateChange: (state: PathfindingState) => void;
  private onRobotMove: (position: Position) => void;
  private animationSpeed: number = 500;

  constructor(
    obstacles: Set<string>,
    onStateChange: (state: PathfindingState) => void,
    onRobotMove: (position: Position) => void
  ) {
    this.obstacles = obstacles;
    this.onStateChange = onStateChange;
    this.onRobotMove = onRobotMove;
  }

  public async startPathfinding(): Promise<void> {
    this.state = {
      isRunning: true,
      currentPath: [],
      visitedCells: new Set(),
      knownObstacles: new Set(),
      status: "RUNNING",
    };
    this.updateState();

    const totalPath = await this.bfsUnknownObstacles(
      START_POSITION,
      GOAL_POSITION
    );

    if (totalPath.length === 0) {
      this.state.status = "NO_PATH";
    } else if (
      totalPath.length > 0 &&
      totalPath[totalPath.length - 1][0] === GOAL_POSITION[0] &&
      totalPath[totalPath.length - 1][1] === GOAL_POSITION[1]
    ) {
      this.state.status = "GOAL_REACHED";
    }

    this.state.isRunning = false;
    this.updateState();
  }

  private async bfsUnknownObstacles(
    start: Position,
    goal: Position
  ): Promise<Position[]> {
    const knownObstacles = new Set<string>(this.state.knownObstacles);
    let robot: Position = [...start];
    const totalPath: Position[] = [];

    while (true) {
      // Update state to show we're planning
      this.state.status = "PLANNING";
      this.updateState();
      await sleep(this.animationSpeed / 2);

      // Find path from current position to goal
      const result = this.findPath(robot, goal, knownObstacles);

      if (!result.found) {
        this.state.status = "NO_PATH";
        this.updateState();
        return totalPath;
      }

      // Update the current planned path
      this.state.currentPath = result.path;
      this.updateState();
      await sleep(this.animationSpeed / 2);

      // Follow path and detect obstacles
      for (const pos of result.path) {
        const key = posToStr(pos);

        if (this.obstacles.has(key)) {
          // Obstacle detected - add to known obstacles
          knownObstacles.add(key);
          this.state.knownObstacles = knownObstacles;
          this.state.status = "OBSTACLE_DETECTED";
          this.updateState();
          await sleep(this.animationSpeed);
          break;
        } else {
          // Move robot to next position
          this.state.status = "MOVING";
          this.updateState();

          // Animate robot movement
          robot = pos;
          this.onRobotMove(robot);
          totalPath.push([...robot]);

          // Add position to visited cells
          this.state.visitedCells.add(posToStr(robot));
          this.updateState();

          await sleep(this.animationSpeed);

          // Check if goal reached
          if (robot[0] === goal[0] && robot[1] === goal[1]) {
            this.state.status = "GOAL_REACHED";
            this.updateState();
            return totalPath;
          }
        }
      }
    }
  }

  private findPath(
    start: Position,
    goal: Position,
    knownObstacles: Set<string>
  ): { found: boolean; path: Position[] } {
    const queue: Position[] = [start];
    const visited = new Set<string>([posToStr(start)]);
    const parent: Record<string, Position> = {};

    let found = false;

    while (queue.length) {
      const [x, y] = queue.shift()!;

      if (x === goal[0] && y === goal[1]) {
        found = true;
        break;
      }

      for (const [dx, dy] of DIRECTIONS) {
        const nx = x + dx;
        const ny = y + dy;
        const next: Position = [nx, ny];
        const key = posToStr(next);

        if (
          isValidPosition(nx, ny) &&
          !knownObstacles.has(key) &&
          !visited.has(key)
        ) {
          visited.add(key);
          parent[key] = [x, y];
          queue.push(next);
        }
      }
    }

    if (!found) {
      return { found: false, path: [] };
    }

    // Reconstruct path
    const path: Position[] = [];
    let current = goal;

    while (posToStr(current) !== posToStr(start)) {
      path.push(current);
      current = parent[posToStr(current)];
    }

    path.push(start);
    path.reverse();

    return { found: true, path };
  }

  private updateState(): void {
    this.onStateChange({ ...this.state });
  }

  public reset(): void {
    this.state = {
      isRunning: false,
      currentPath: [],
      visitedCells: new Set(),
      knownObstacles: new Set(),
      status: "IDLE",
    };
    this.updateState();
  }
}
