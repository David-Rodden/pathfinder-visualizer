import {usePathfinding} from '@/hooks/usePathfinding';
import Tile from './Tile';
import React, {forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState} from 'react';
import {TileType} from "@/types";
import {bfs} from '@/lib/algorithms';

const GRID_SIZE = 20;

const Grid = forwardRef<{ findPath: () => void, resetGrid: () => void }, { algorithm: string }>(({algorithm}, ref) => {
    const {path, findPath, visitedNodes, setPath, setVisitedNodes, cancelTraversal} = usePathfinding();
    const [grid, setGrid] = useState<TileType[][]>([]);

    const start = useMemo<[number, number]>(() => [0, 0], []);
    const end = useMemo<[number, number]>(() => [GRID_SIZE - 1, GRID_SIZE - 1], []);

    const generateGrid = useCallback(() => {
        let newGrid: TileType[][] = [];
        let pathExists = false;

        let attempts = 0;
        const MAX_ATTEMPTS = 100;

        while (!pathExists && attempts < MAX_ATTEMPTS) {
            newGrid = Array.from({length: GRID_SIZE}, () =>
                Array.from({length: GRID_SIZE}, () =>
                    Math.random() < 0.3 ? 'blocked' : 'free'
                )
            );

            newGrid[start[0]][start[1]] = 'start';
            newGrid[end[0]][end[1]] = 'end';

            const {result} = algorithm === 'bfs' ? bfs(newGrid, start, end) : bfs(newGrid, start, end);
            pathExists = result.length > 0;

            attempts++;
        }

        if (attempts === MAX_ATTEMPTS) {
            console.warn("Failed to generate a completable grid within attempt limit.");
        }

        setGrid(newGrid);
    }, [start, end, algorithm]);

    useImperativeHandle(ref, () => ({
        findPath: () => {
            setPath([]);  // Clear path before starting
            setVisitedNodes([]);
            findPath(grid, start, end);
        },
        resetGrid: () => {
            cancelTraversal();  // Stop all current visualizations
            generateGrid();  // Regenerate grid
        }
    }));

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
});

Grid.displayName = 'Grid';

export default Grid;
