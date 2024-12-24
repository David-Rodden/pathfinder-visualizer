import React, { forwardRef } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { followCursor } from 'tippy.js';

type TileProps = {
    state: 'free' | 'blocked' | 'path' | 'start' | 'end' | 'visited' | 'traversed';
    isStart?: boolean;
    isEnd?: boolean;
    isPath?: boolean;
    isVisited?: boolean;
};

const getDescription = (state: TileProps['state']) => {
    switch (state) {
        case 'start':
            return 'Start Point';
        case 'end':
            return 'End Point';
        case 'blocked':
            return 'Blocked Tile';
        case 'path':
            return 'Path Tile';
        case 'visited':
            return 'Visited Tile';
        case 'traversed':
            return 'Traversed Tile';
        default:
            return 'Free Tile';
    }
};

const Tile = forwardRef<HTMLDivElement, TileProps>(({ state, isStart, isEnd, isPath, isVisited }, ref) => {
    const bgColor = () => {
        if (state === 'blocked') return 'bg-black';
        if (isPath) return 'bg-green-500';
        if (isVisited) return 'bg-red-400';
        if (state === 'traversed') return 'bg-blue-400';
        return 'bg-white hover:bg-gray-200';
    };

    return (
        <Tippy content={getDescription(state)} delay={[300, 0]} plugins={[followCursor]} placement="top">
            <div
                ref={ref}
                className={`w-8 h-8 border flex items-center justify-center transition-colors duration-150 ${bgColor()}`}
            >
                {isStart && (
                    <span role="img" aria-label="start">
                        🚩
                    </span>
                )}
                {isEnd && (
                    <span role="img" aria-label="end">
                        🏁
                    </span>
                )}
            </div>
        </Tippy>
    );
});

Tile.displayName = 'Tile';
export default Tile;
