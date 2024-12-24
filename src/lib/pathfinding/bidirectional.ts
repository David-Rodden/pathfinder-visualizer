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

    while (queueStart.length && queueEnd.length) {
        // Process from start
        if (queueStart.length) {
            const [sx, sy] = queueStart.shift()!;
            const sKey = `${sx},${sy}`;

            if (visitedEnd.has(sKey)) {
                return {
                    result: [
                        ...reconstructPath(cameFromStart, [sx, sy]),
                        ...reconstructPath(cameFromEnd, [sx, sy]).reverse(),
                    ],
                    visited: new Set([...visitedStart, ...visitedEnd]),
                    visitedStart,
                    visitedEnd,
                };
            }
            visitedStart.add(sKey);
            expandNode(sx, sy, queueStart, visitedStart, cameFromStart, grid);
        }

        // Process from end
        if (queueEnd.length) {
            const [ex, ey] = queueEnd.shift()!;
            const eKey = `${ex},${ey}`;

            if (visitedStart.has(eKey)) {
                return {
                    result: [
                        ...reconstructPath(cameFromStart, [ex, ey]),
                        ...reconstructPath(cameFromEnd, [ex, ey]).reverse(),
                    ],
                    visited: new Set([...visitedStart, ...visitedEnd]),
                    visitedStart,
                    visitedEnd,
                };
            }
            visitedEnd.add(eKey);
            expandNode(ex, ey, queueEnd, visitedEnd, cameFromEnd, grid);
        }
    }
    return { result: [], visited: visitedStart, visitedStart, visitedEnd };
};

// Node Expansion
const expandNode = (
    x: number,
    y: number,
    queue: [number, number][],
    visited: Set<string>,
    cameFrom: Map<string, [number, number]>,
    grid: GridType,
) => {
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
};
