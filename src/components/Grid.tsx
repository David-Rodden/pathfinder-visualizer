import {usePathfinding} from '@/hooks/usePathfinding';
import Tile from './Tile';
import React, {useCallback, useEffect, useState} from 'react';
import {TileType} from "@/types";

const GRID_SIZE = 20;

const Grid: React.FC = () => {
    const {path, findPath} = usePathfinding();
    const [grid, setGrid] = useState<Array<Array<'blocked' | 'free' | 'start' | 'end'>>>([]);

    // Start and End Points
    const start = [0, 0];
    const end = [GRID_SIZE - 1, GRID_SIZE - 1];

    // Generate Random Blocked Tiles (with ensured path)
    const generateGrid = useCallback(() => {
        const newGrid: TileType[][] = Array.from({length: GRID_SIZE}, () =>
            Array.from({length: GRID_SIZE}, () =>
                Math.random() < 0.3 ? 'blocked' : 'free'
            )
        );

        // Ensure start and end are always free
        newGrid[start[0]][start[1]] = 'start';
        newGrid[end[0]][end[1]] = 'end';

        // Ensure path exists
        findPath(newGrid, start as [number, number], end as [number, number]);
        setGrid(newGrid);
    }, [findPath]);

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
                    return (
                        <Tile
                            key={`${x}-${y}`}
                            state={tile}
                            isStart={x === start[0] && y === start[1]}
                            isEnd={x === end[0] && y === end[1]}
                            isPath={isPath}
                        />
                    );
                })
            )}
        </div>
    );
};

export default Grid;
