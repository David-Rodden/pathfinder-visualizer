import { BidirectionalPathResult, buildBidirectionalResult, GridType, PathResult } from './utils';

export abstract class BaseSearch {
    protected grid: GridType;

    constructor(grid: GridType) {
        this.grid = grid;
    }

    public search(
        start: [number, number],
        end: [number, number],
        bidirectional = false,
    ): PathResult | BidirectionalPathResult {
        return bidirectional ? this.searchBidirectional(start, end) : this.searchSingle(start, end);
    }

    protected abstract searchSingle(start: [number, number], end: [number, number]): PathResult;

    protected searchBidirectional(start: [number, number], end: [number, number]): BidirectionalPathResult {
        const visitedStart = new Set<string>(),
            visitedEnd = new Set<string>();
        const cameFromStart = new Map<string, [number, number]>();
        const cameFromEnd = new Map<string, [number, number]>();
        const queueStart: [number, number][] = [start];
        const queueEnd: [number, number][] = [end];

        visitedStart.add(`${start[0]},${start[1]}`);
        visitedEnd.add(`${end[0]},${end[1]}`);

        while (queueStart.length && queueEnd.length) {
            const intersect = this.processStep(queueStart, visitedStart, visitedEnd, cameFromStart);
            if (intersect) {
                return buildBidirectionalResult(intersect, cameFromStart, cameFromEnd, visitedStart, visitedEnd);
            }
            const intersect2 = this.processStep(queueEnd, visitedEnd, visitedStart, cameFromEnd);
            if (intersect2) {
                return buildBidirectionalResult(intersect2, cameFromStart, cameFromEnd, visitedStart, visitedEnd);
            }
        }

        return {
            result: [],
            visited: new Set([...visitedStart, ...visitedEnd]),
            visitedStart,
            visitedEnd,
        };
    }

    protected processStep(
        queue: [number, number][],
        visitedThis: Set<string>,
        visitedOther: Set<string>,
        cameFrom: Map<string, [number, number]>,
    ): [number, number] | null {
        if (!queue.length) return null;
        const [x, y] = queue.shift()!;
        const key = `${x},${y}`;
        if (visitedOther.has(key)) return [x, y];
        for (const [dx, dy] of [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
        ]) {
            const nx = x + dx,
                ny = y + dy;
            const nKey = `${nx},${ny}`;
            if (
                nx >= 0 &&
                ny >= 0 &&
                nx < this.grid.length &&
                ny < this.grid[0].length &&
                this.grid[nx][ny] !== 'blocked' &&
                !visitedThis.has(nKey)
            ) {
                visitedThis.add(nKey);
                cameFrom.set(nKey, [x, y]);
                queue.push([nx, ny]);
            }
        }
        return null;
    }
}
