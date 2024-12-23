export const bfs = (grid: string[][], start: [number, number], end: [number, number]): number[][] => {
    const rows = grid.length;
    const cols = grid[0].length;
    const queue: [number, number, number[][]][] = [[...start, []]];
    const visited = new Set<string>();

    const isInBounds = (x: number, y: number) => x >= 0 && y >= 0 && x < rows && y < cols;

    while (queue.length) {
        const [x, y, currPath] = queue.shift()!;
        const key = `${x},${y}`;
        if (x === end[0] && y === end[1]) return [...currPath, [x, y]];
        if (!isInBounds(x, y) || visited.has(key) || grid[x][y] === 'blocked') continue;
        visited.add(key);
        const newPath = [...currPath, [x, y]];
        queue.push([x + 1, y, newPath]);
        queue.push([x - 1, y, newPath]);
        queue.push([x, y + 1, newPath]);
        queue.push([x, y - 1, newPath]);
    }
    return [];
};
