import { BaseSearch } from './BaseSearch';
import { GridType, PathResult, reconstructPath } from './utils';
import { PriorityQueue } from './priorityQueue';

type HeuristicFunction = (a: [number, number], b: [number, number]) => number;

export abstract class WeightedSearch extends BaseSearch {
    private readonly heuristicFn: HeuristicFunction;

    constructor(grid: GridType, heuristic: HeuristicFunction) {
        super(grid);
        this.heuristicFn = heuristic;
    }

    protected searchSingle(start: [number, number], end: [number, number]): PathResult {
        const visited = new Set<string>();
        const cameFrom = new Map<string, [number, number]>();
        const distMap: Record<string, number> = { [`${start[0]},${start[1]}`]: 0 };
        const pq = new PriorityQueue<[number, number]>();
        pq.enqueue(start, this.heuristicFn(start, end));

        while (!pq.isEmpty()) {
            const current = pq.dequeue();
            if (!current) break;
            const [x, y] = current;
            const key = `${x},${y}`;
            if (visited.has(key)) continue;
            visited.add(key);
            if (x === end[0] && y === end[1]) {
                return { result: reconstructPath(cameFrom, end), visited };
            }

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
                    this.grid[nx][ny] !== 'blocked'
                ) {
                    const newDist = (distMap[key] ?? Infinity) + 1;
                    if (newDist < (distMap[nKey] ?? Infinity)) {
                        distMap[nKey] = newDist;
                        cameFrom.set(nKey, [x, y]);
                        pq.enqueue([nx, ny], newDist + this.heuristicFn([nx, ny], end));
                    }
                }
            }
        }
        return { result: [], visited };
    }
}
