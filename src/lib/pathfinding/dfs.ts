import { GridType, PathResult } from './utils';
import { traverseGrid } from './traverse';

export const dfs = (
    grid: GridType,
    start: [number, number],
    end: [number, number]
): PathResult => traverseGrid(grid, start, end, 'dfs');
