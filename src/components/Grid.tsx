import {usePathfinding} from '@/hooks/usePathfinding';
import Tile from './Tile';
import React, {useEffect, useMemo} from 'react';

const Grid: React.FC = () => {
    const {path, findPath} = usePathfinding();

    const grid = useMemo(() =>
        Array.from({length: 20}, () =>
            Array.from({length: 20}, () => 'free')
        ), []
    );

    useEffect(() => {
        findPath(grid, [0, 0], [19, 19]);
    }, [findPath, grid]);

    return (
        <div
            className="grid gap-1 justify-center"
            style={{gridTemplateColumns: 'repeat(20, 2rem)'}}>
            {grid.flatMap((row, x) =>
                row.map((_, y) => {
                    const isPath = path.some(([px, py]) => px === x && py === y);
                    return <Tile key={`${x}-${y}`} state={isPath ? 'path' : 'free'}/>;
                })
            )}
        </div>
    );
};

export default Grid;
