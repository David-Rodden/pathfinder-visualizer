export type GridType = string[][];

export interface PathResult {
    result: [number, number][];
    visited: Set<string>;
}

export interface BidirectionalPathResult extends PathResult {
    visitedStart: Set<string>;
    visitedEnd: Set<string>;
}

export const isInBounds = (x: number, y: number, grid: GridType): boolean =>
    x >= 0 && y >= 0 && x < grid.length && y < grid[0].length;

export const reconstructPath = (cameFrom: Map<string, [number, number]>, end: [number, number]): [number, number][] => {
    const path: [number, number][] = [];
    let curr = `${end[0]},${end[1]}`;
    while (cameFrom.has(curr)) {
        const [px, py] = cameFrom.get(curr)!;
        path.unshift([px, py]);
        curr = `${px},${py}`;
    }
    path.push(end);
    return path;
};

// Simple Manhattan distance for A*:
export const heuristic = ([x1, y1]: [number, number], [x2, y2]: [number, number]): number =>
    Math.abs(x1 - x2) + Math.abs(y1 - y2);

export function buildBidirectionalResult(
    meet: [number, number],
    cameFromStart: Map<string, [number, number]>,
    cameFromEnd: Map<string, [number, number]>,
    visitedStart: Set<string>,
    visitedEnd: Set<string>,
): BidirectionalPathResult {
    const pathStart = reconstructPath(cameFromStart, meet);
    const pathEnd = reconstructPath(cameFromEnd, meet).reverse();
    return {
        result: [...pathStart, ...pathEnd],
        visited: new Set([...visitedStart, ...visitedEnd]),
        visitedStart,
        visitedEnd,
    };
}
