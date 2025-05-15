import { Position } from '../types';
import { GRID_SIZE } from '../constants';

export function posToStr(position: Position): string {
  return `${position[0]},${position[1]}`;
}

export function strToPos(str: string): Position {
  const [x, y] = str.split(',').map(Number);
  return [x, y];
}

export function isValidPosition(x: number, y: number): boolean {
  return x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE;
}

export function arePositionsEqual(pos1: Position, pos2: Position): boolean {
  return pos1[0] === pos2[0] && pos1[1] === pos2[1];
}

export function getPositionStyles(position: Position, cellSize: number): React.CSSProperties {
  return {
    left: `${position[1] * cellSize}px`,
    top: `${position[0] * cellSize}px`,
  };
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}