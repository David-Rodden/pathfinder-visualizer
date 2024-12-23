"use client";
import React, {useEffect, useState} from 'react';

type TileProps = {
    state: 'free' | 'blocked' | 'path';
};

const Tile: React.FC<TileProps> = ({state}) => {
    const [type, setType] = useState(state);

    useEffect(() => {
        setType(state);
    }, [state]);

    return (
        <div
            className={`w-8 h-8 border ${
                type === 'blocked' ? 'bg-black' : type === 'path' ? 'bg-blue-500' : 'bg-white'
            }`}
            onClick={() => setType(type === 'free' ? 'blocked' : 'free')}
        />
    );
};

export default Tile;
