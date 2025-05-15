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
  private stopped = false;

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
    this.stopped = false;

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

    if (this.stopped) return;

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

    while (!this.stopped) {
      this.state.status = "PLANNING";
      this.updateState();
      await sleep(this.animationSpeed / 2);
      if (this.stopped) return [];

      const result = this.findPath(robot, goal, knownObstacles);

      if (!result.found) {
        this.state.status = "NO_PATH";
        this.updateState();
        return totalPath;
      }

      this.state.currentPath = result.path;
      this.updateState();
      await sleep(this.animationSpeed / 2);
      if (this.stopped) return [];

      for (const pos of result.path) {
        if (this.stopped) return [];

        const key = posToStr(pos);

        if (this.obstacles.has(key)) {
          knownObstacles.add(key);
          this.state.knownObstacles = knownObstacles;
          this.state.status = "OBSTACLE_DETECTED";
          this.updateState();
          await sleep(this.animationSpeed);
          break;
        } else {
          this.state.status = "MOVING";
          this.updateState();

          robot = pos;
          this.onRobotMove(robot);
          totalPath.push([...robot]);
          this.state.visitedCells.add(posToStr(robot));
          this.updateState();

          await sleep(this.animationSpeed);
          if (this.stopped) return [];

          if (robot[0] === goal[0] && robot[1] === goal[1]) {
            this.state.status = "GOAL_REACHED";
            this.updateState();
            return totalPath;
          }
        }
      }
    }

    return totalPath;
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
    this.stopped = true;

    this.state = {
      isRunning: false,
      currentPath: [],
      visitedCells: new Set(),
      knownObstacles: new Set(),
      status: "IDLE",
    };
    this.updateState();
  }

  public stop(): void {
    this.stopped = true;
  }
}
