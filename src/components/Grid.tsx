import { usePathfinding } from '@/hooks/usePathfinding';
import Tile from './Tile';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { TileType } from '@/types';
import { aStar, bfs, bidirectionalSearch, dfs, dijkstra } from '@/lib/pathfinding';

const GRID_SIZE = 20;

const Grid = forwardRef<
    { findPath: () => void; resetGrid: () => void; timerInterval?: NodeJS.Timeout | null },
    { algorithm: string; setTimer: (t: number) => void; setRunning: (r: boolean) => void }
    // eslint-disable-next-line no-extra-parens
>(({ algorithm, setTimer, setRunning }, ref) => {
    const { path, visitedNodes, findPath, cancelTraversal, setPath, setVisitedNodes } = usePathfinding();
    const [grid, setGrid] = useState<TileType[][]>([]);
    const intervalRef = useRef<NodeJS.Timeout | null>(null); // Track interval

    const start = useMemo<[number, number]>(() => [0, 0], []);
    const end = useMemo<[number, number]>(() => [GRID_SIZE - 1, GRID_SIZE - 1], []);

    const getAlgorithm = useCallback(() => {
        cancelTraversal();
        setTimer(0);
        setRunning(false);
        switch (algorithm) {
            case 'dfs':
                return dfs;
            case 'dijkstra':
                return dijkstra;
            case 'aStar':
                return aStar;
            case 'bidirectional':
                return bidirectionalSearch;
            default:
                return bfs;
        }
    }, [algorithm, cancelTraversal, setTimer, setRunning]);

    const generateGrid = useCallback(() => {
        let newGrid: TileType[][] = [];
        let pathExists = false;
        let attempts = 0;
        const MAX_ATTEMPTS = 100;

        while (!pathExists && attempts < MAX_ATTEMPTS) {
            newGrid = Array.from({ length: GRID_SIZE }, () =>
                Array.from({ length: GRID_SIZE }, () => (Math.random() < 0.3 ? 'blocked' : 'free')),
            );
            newGrid[start[0]][start[1]] = 'start';
            newGrid[end[0]][end[1]] = 'end';

            const { result } = bfs(newGrid, start, end);
            pathExists = result.length > 0;
            attempts++;
        }
        setGrid(newGrid);
        setPath([]);
        setVisitedNodes([]);
    }, [start, end, setPath, setVisitedNodes]);

    const handleStart = () => {
        const algorithmFn = getAlgorithm();
        setPath([]);
        setVisitedNodes([]);
        setTimer(0);
        setRunning(true);

        const startTime = performance.now();
        intervalRef.current = setInterval(() => {
            setTimer(performance.now() - startTime);
        }, 10);

        findPath(grid, start, end, algorithmFn).then(() => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            setRunning(false);
        });
    };

    useImperativeHandle(ref, () => ({
        findPath: handleStart,
        resetGrid: () => {
            cancelTraversal();
            generateGrid();
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null; // Ensure null to avoid type conflicts
            }
        },
        timerInterval: intervalRef.current as NodeJS.Timeout | undefined, // Fix type assertion
    }));

    useEffect(() => {
        generateGrid();
    }, [generateGrid]);

    return (
        <div className="grid gap-1 justify-center" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 2rem)` }}>
            {grid.flatMap((row, x) =>
                row.map((tile, y) => {
                    const isPath = path.some(([px, py]) => px === x && py === y);
                    const isVisited = visitedNodes.some(([vx, vy]) => vx === x && vy === y);

                    // Dynamically determine tile state based on pathfinding
                    const dynamicState: TileType =
                        x === start[0] && y === start[1]
                            ? 'start'
                            : x === end[0] && y === end[1]
                              ? 'end'
                              : isPath
                                ? 'path'
                                : isVisited
                                  ? 'traversed' // New traversed state for visited tiles
                                  : tile;

                    return (
                        <Tile
                            key={`${x}-${y}`}
                            state={dynamicState} // Use dynamically determined state
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
