// bidirectional.ts
import { BidirectionalPathResult, GridType, isInBounds, reconstructPath } from './utils';

export const bidirectionalSearch = (
    grid: GridType,
    start: [number, number],
    end: [number, number],
): BidirectionalPathResult => {
    const visitedStart = new Set<string>();
    const visitedEnd = new Set<string>();
    const cameFromStart = new Map<string, [number, number]>();
    const cameFromEnd = new Map<string, [number, number]>();

    const queueStart: [number, number][] = [start];
    const queueEnd: [number, number][] = [end];

    /**
     * Process exactly one node from "this side."
     * If we detect intersection with the other side => return that intersection node.
     */
    const processStep = (
        queue: [number, number][],
        visitedThisSide: Set<string>,
        visitedOtherSide: Set<string>,
        cameFromThisSide: Map<string, [number, number]>,
    ): [number, number] | null => {
        if (!queue.length) return null;

        const [x, y] = queue.shift()!;
        const key = `${x},${y}`;

        // If the other side has visited this node => path is found!
        if (visitedOtherSide.has(key)) {
            return [x, y];
        }

        // Otherwise, record visited and expand neighbors
        visitedThisSide.add(key);
        expandNode(x, y, queue, visitedThisSide, cameFromThisSide, grid);
        return null;
    };

    while (queueStart.length && queueEnd.length) {
        // 1) Expand from the start side (one node only)
        const intersectA = processStep(queueStart, visitedStart, visitedEnd, cameFromStart);
        if (intersectA) {
            // Return the path result immediately => no expansions from the end side
            return buildResult(intersectA, cameFromStart, cameFromEnd, visitedStart, visitedEnd);
        }

        // 2) If no intersection from start side, expand from the end side (one node)
        const intersectB = processStep(queueEnd, visitedEnd, visitedStart, cameFromEnd);
        if (intersectB) {
            return buildResult(intersectB, cameFromStart, cameFromEnd, visitedStart, visitedEnd);
        }
    }

    // No path found
    return {
        result: [],
        visited: visitedStart, // or union them if you want all visited from both sides
        visitedStart,
        visitedEnd,
    };
};

/**
 * Expand neighbors BFS-style from (x,y).
 */
function expandNode(
    x: number,
    y: number,
    queue: [number, number][],
    visited: Set<string>,
    cameFrom: Map<string, [number, number]>,
    grid: GridType,
) {
    for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
    ]) {
        const nx = x + dx,
            ny = y + dy;
        const key = `${nx},${ny}`;

        if (isInBounds(nx, ny, grid) && grid[nx][ny] !== 'blocked' && !visited.has(key)) {
            queue.push([nx, ny]);
            cameFrom.set(key, [x, y]);
        }
    }
}

/**
 * Once we detect intersection at (ix, iy),
 * reconstruct the path from both sides,
 * then return the final BidirectionalPathResult.
 */
function buildResult(
    [ix, iy]: [number, number],
    cameFromStart: Map<string, [number, number]>,
    cameFromEnd: Map<string, [number, number]>,
    visitedStart: Set<string>,
    visitedEnd: Set<string>,
): BidirectionalPathResult {
    const pathStart = reconstructPath(cameFromStart, [ix, iy]);
    const pathEnd = reconstructPath(cameFromEnd, [ix, iy]).reverse();

    return {
        result: [...pathStart, ...pathEnd],
        visited: new Set([...visitedStart, ...visitedEnd]),
        visitedStart,
        visitedEnd,
    };
}
