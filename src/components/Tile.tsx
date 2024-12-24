import React, { forwardRef } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { followCursor } from 'tippy.js';
import { TileType } from '@/types';

type TileProps = {
    state: TileType;
    isStart?: boolean;
    isEnd?: boolean;
    isPath?: boolean;
    isVisited?: boolean;
};

const descriptions: Record<TileType, string> = {
    start: 'Start Point',
    end: 'End Point',
    blocked: 'Blocked Tile',
    path: 'Path Tile',
    traversed: 'Traversed Tile',
    free: 'Free Tile',
};

const Tile = forwardRef<HTMLDivElement, TileProps>(({ state, isStart, isEnd, isPath, isVisited }, ref) => {
    const bgColor = () =>
        state === 'blocked'
            ? 'bg-black'
            : isPath
              ? 'bg-green-500'
              : isVisited
                ? 'bg-red-400'
                : state === 'traversed'
                  ? 'bg-blue-400'
                  : 'bg-white hover:bg-gray-200';

    return (
        <Tippy content={descriptions[state]} delay={[300, 0]} plugins={[followCursor]} placement="top">
            <div
                ref={ref}
                className={`w-8 h-8 border flex items-center justify-center transition-colors duration-150 ${bgColor()}`}
            >
                {isStart ? '🚩' : isEnd ? '🏁' : null}
            </div>
        </Tippy>
    );
});

Tile.displayName = 'Tile';
export default Tile;
