import { GridType, heuristic, isInBounds, PathResult, reconstructPath } from './utils';
import { PriorityQueue } from './priorityQueue';

type Strategy = 'bfs' | 'dfs' | 'dijkstra' | 'aStar' | 'bidirectional';

export function traverseGrid(
    grid: GridType,
    start: [number, number],
    end: [number, number],
    strategy: Strategy,
): PathResult {
    const visited = new Set<string>();
    const cameFrom = new Map<string, [number, number]>();

    // Distances store (for BFS/DFS it's mostly "just in case")
    // but it unifies the logic so all algos can be handled similarly:
    const distMap: Record<string, number> = {};
    distMap[`${start[0]},${start[1]}`] = 0;

    // BFS/DFS will use a simple array as a queue/stack
    const container: [number, number][] = [[...start]];
    // Dijkstra / A* will use a priority queue
    const pq = new PriorityQueue<[number, number]>();

    // Initialize PQ if needed:
    if (strategy === 'dijkstra' || strategy === 'aStar') {
        const initialPriority =
            strategy === 'aStar'
                ? heuristic(start, end) // distance(=0) + heuristic
                : 0; // distance(=0)
        pq.enqueue(start, initialPriority);
        // For BFS/DFS, we do nothing special here
    }

    // Helper to remove an element from either container or PQ
    const popNode = (): [number, number] | undefined => {
        if (strategy === 'bfs') return container.shift();
        if (strategy === 'dfs') return container.pop();
        return pq.dequeue(); // for dijkstra / aStar
    };

    // Keep looping while there's work in either the array or the priority queue
    while (
        strategy === 'bfs' || strategy === 'dfs'
            ? container.length
            : strategy === 'dijkstra' || strategy === 'aStar'
              ? !pq.isEmpty()
              : false
    ) {
        const current = popNode();
        if (!current) break; // empty structure

        const [x, y] = current;
        const key = `${x},${y}`;
        if (visited.has(key)) continue;
        visited.add(key);

        // If we found the goal
        if (x === end[0] && y === end[1]) return { result: reconstructPath(cameFrom, end), visited };

        // Expand neighbors
        for (const [dx, dy] of [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
        ]) {
            const nx = x + dx,
                ny = y + dy;
            if (!isInBounds(nx, ny, grid) || grid[nx][ny] === 'blocked') continue;

            const neighborKey = `${nx},${ny}`;
            if (visited.has(neighborKey)) continue;

            const newDist = (distMap[key] ?? 0) + 1;
            if (newDist < (distMap[neighborKey] ?? Infinity)) {
                distMap[neighborKey] = newDist;
                cameFrom.set(neighborKey, [x, y]);
            }

            // BFS/DFS => normal container usage
            // Dijkstra => PQ with newDist
            // A* => PQ with newDist + heuristic
            if (strategy === 'bfs' || strategy === 'dfs') container.push([nx, ny]);
            else if (strategy === 'dijkstra') pq.enqueue([nx, ny], newDist);
            else pq.enqueue([nx, ny], newDist + heuristic([nx, ny], end));
        }
    }

    // If we exhaust everything without finding the end:
    return { result: [], visited };
}
