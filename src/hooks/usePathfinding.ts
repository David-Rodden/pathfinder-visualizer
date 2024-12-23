"use client";
import {useCallback, useState} from 'react';
import {bfs} from '@/lib/algorithms';

export const usePathfinding = () => {
    const [path, setPath] = useState<number[][]>([]);

    const findPath = useCallback((grid: string[][], start: [number, number], end: [number, number]) => {
        const result = bfs(grid, start, end);
        setPath(result);
    }, []);

    return {path, findPath};
};
