import {usePathfinding} from '@/hooks/usePathfinding';
import Tile from './Tile';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {TileType} from "@/types";
import {bfs} from '@/lib/algorithms';

const GRID_SIZE = 20;

const Grid: React.FC = () => {
    const {path, findPath, visitedNodes} = usePathfinding();
    const [grid, setGrid] = useState<TileType[][]>([]);

    const start = useMemo<[number, number]>(() => [0, 0], []);
    const end = useMemo<[number, number]>(() => [GRID_SIZE - 1, GRID_SIZE - 1], []);

    // Generate Grid with Valid Path
    const generateGrid = useCallback(() => {
        let newGrid: TileType[][] = [];
        let pathExists = false;

        let attempts = 0;  // Attempt counter
        const MAX_ATTEMPTS = 100;  // Maximum number of retries

        while (!pathExists && attempts < MAX_ATTEMPTS) {
            // 1. Generate random grid
            newGrid = Array.from({length: GRID_SIZE}, () =>
                Array.from({length: GRID_SIZE}, () =>
                    Math.random() < 0.3 ? 'blocked' : 'free'
                )
            );

            // 2. Set start and end points
            newGrid[start[0]][start[1]] = 'start';
            newGrid[end[0]][end[1]] = 'end';

            // 3. Check if path exists
            const {result} = bfs(newGrid, start, end);
            pathExists = result.length > 0;

            attempts++;  // Increment attempt counter
        }

        if (attempts === MAX_ATTEMPTS) {
            console.warn("Failed to generate a completable grid within attempt limit.");
        }

        // 4. Run pathfinding on valid grid
        findPath(newGrid, start, end);
        setGrid(newGrid);
    }, [end, findPath, start]);


    // Generate grid on mount
    useEffect(() => {
        generateGrid();
    }, [generateGrid]);

    return (
        <div
            className="grid gap-1 justify-center"
            style={{gridTemplateColumns: `repeat(${GRID_SIZE}, 2rem)`}}
        >
            {grid.flatMap((row, x) =>
                row.map((tile, y) => {
                    const isPath = path.some(([px, py]) => px === x && py === y);
                    const isVisited = visitedNodes.some(([vx, vy]) => vx === x && vy === y);
                    return (
                        <Tile
                            key={`${x}-${y}`}
                            state={tile}
                            isStart={x === start[0] && y === start[1]}
                            isEnd={x === end[0] && y === end[1]}
                            isPath={isPath}
                            isVisited={isVisited}
                        />
                    );
                })
            )}
        </div>
    );
};

export default Grid;
