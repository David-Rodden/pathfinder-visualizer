import { usePathfinding } from '@/hooks/usePathfinding';
import Tile from './Tile';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { AlgorithmType, TileType } from '@/types';
import { AStarSearch, BaseSearch, BfsSearch, DfsSearch, DijkstraSearch } from '@/lib/pathfinding';

const GRID_SIZE = 20;

interface GridProps {
    algorithm: AlgorithmType;
    setTimer: (t: number) => void;
    setRunning: (r: boolean) => void;
    isBidirectional: boolean;
}

interface GridHandle {
    findPath: () => void;
    resetGrid: () => void;
    timerInterval?: NodeJS.Timeout | null;
}

const algorithmMap: Record<Exclude<AlgorithmType, 'bidirectional'>, new (grid: TileType[][]) => BaseSearch> = {
    bfs: BfsSearch,
    dfs: DfsSearch,
    dijkstra: DijkstraSearch,
    aStar: AStarSearch,
};

const Grid = forwardRef<GridHandle, GridProps>(({ algorithm, setTimer, setRunning, isBidirectional }, ref) => {
    const { path, visitedNodes, findPath, cancelTraversal, setPath, setVisitedNodes } = usePathfinding();
    const [grid, setGrid] = useState<TileType[][]>([]);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const start = useMemo(() => [0, 0] as [number, number], []);
    const end = useMemo(() => [GRID_SIZE - 1, GRID_SIZE - 1] as [number, number], []);

    const generateGrid = useCallback(() => {
        let pathExists = false;
        let attempts = 0;
        const MAX_ATTEMPTS = 100;

        while (!pathExists && attempts++ < MAX_ATTEMPTS) {
            const newGrid: TileType[][] = Array.from({ length: GRID_SIZE }, () =>
                Array.from({ length: GRID_SIZE }, () => (Math.random() < 0.3 ? 'blocked' : 'free')),
            );
            newGrid[start[0]][start[1]] = 'start';
            newGrid[end[0]][end[1]] = 'end';

            const bfsSearch = new BfsSearch(newGrid);
            pathExists = bfsSearch.search(start, end).result.length > 0;

            if (pathExists) {
                setGrid(newGrid);
                setPath([]);
                setVisitedNodes([]);
            }
        }
    }, [start, end, setPath, setVisitedNodes]);

    const handleStart = () => {
        const AlgorithmClass = algorithmMap[algorithm];
        const algorithmInstance = new AlgorithmClass(grid);

        setPath([]);
        setVisitedNodes([]);
        setTimer(0);
        setRunning(true);

        const startTime = performance.now();
        intervalRef.current = setInterval(() => setTimer(performance.now() - startTime), 10);

        // Pass the bidirectional flag
        findPath(grid, start, end, algorithmInstance, isBidirectional).finally(() => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            setRunning(false);
        });
    };

    useImperativeHandle(ref, () => ({
        findPath: handleStart,
        resetGrid() {
            cancelTraversal();
            generateGrid();
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        },
        timerInterval: intervalRef.current || undefined,
    }));

    useEffect(generateGrid, [generateGrid]);

    return (
        <div className="grid gap-1 justify-center" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 2rem)` }}>
            {grid.flatMap((row, x) =>
                row.map((tile, y) => {
                    const isPath = path.some(([px, py]) => px === x && py === y);
                    const isVisited = visitedNodes.some(([vx, vy]) => vx === x && vy === y);
                    const state: TileType =
                        x === start[0] && y === start[1]
                            ? 'start'
                            : x === end[0] && y === end[1]
                              ? 'end'
                              : isPath
                                ? 'path'
                                : isVisited
                                  ? 'traversed'
                                  : tile;

                    return (
                        <Tile
                            key={`${x}-${y}`}
                            state={state}
                            isStart={x === start[0] && y === start[1]}
                            isEnd={x === end[0] && y === end[1]}
                            isPath={isPath}
                            isVisited={isVisited}
                        />
                    );
                }),
            )}
        </div>
    );
});

Grid.displayName = 'Grid';
export default Grid;
