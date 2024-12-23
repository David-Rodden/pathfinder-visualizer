"use client";
import React, {useEffect, useState} from 'react';

type TileProps = {
    state: 'free' | 'blocked' | 'path' | 'start' | 'end';
    isStart?: boolean;
    isEnd?: boolean;
    isPath?: boolean;
    isVisited?: boolean;
};

const Tile: React.FC<TileProps> = ({state, isStart, isEnd, isPath, isVisited}) => {
    const [type, setType] = useState(state);

    useEffect(() => {
        setType(state);
    }, [state]);

    return (
        <div
            className={`w-8 h-8 border flex items-center justify-center cursor-pointer transition-colors duration-150 ${
                type === 'blocked'
                    ? 'bg-black'
                    : isPath
                        ? 'bg-green-500'
                        : isVisited
                            ? 'bg-red-400'
                            : 'bg-white hover:bg-gray-200'  // Gray hover effect
            }`}
            onClick={() => setType(type === 'free' ? 'blocked' : 'free')}
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
    );
};

export default Tile;
