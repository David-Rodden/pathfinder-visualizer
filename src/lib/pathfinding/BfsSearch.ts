import { BaseSearch } from './BaseSearch';
import { PathResult, reconstructPath } from './utils';

export class BfsSearch extends BaseSearch {
    protected searchSingle(start: [number, number], end: [number, number]): PathResult {
        const visited = new Set<string>();
        const cameFrom = new Map<string, [number, number]>();
        const queue: [number, number][] = [start];

        visited.add(`${start[0]},${start[1]}`);

        while (queue.length) {
            const [x, y] = queue.shift()!;
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
                const key = `${nx},${ny}`;
                if (
                    nx >= 0 &&
                    ny >= 0 &&
                    nx < this.grid.length &&
                    ny < this.grid[0].length &&
                    this.grid[nx][ny] !== 'blocked' &&
                    !visited.has(key)
                ) {
                    visited.add(key);
                    cameFrom.set(key, [x, y]);
                    queue.push([nx, ny]);
                }
            }
        }
        return { result: [], visited };
    }
}
