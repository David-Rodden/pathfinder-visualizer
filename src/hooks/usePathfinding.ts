"use client";
import {useCallback, useState} from 'react';
import {bfs} from '@/lib/algorithms';

export const usePathfinding = () => {
    const [path, setPath] = useState<number[][]>([]);
    const [visitedNodes, setVisitedNodes] = useState<number[][]>([]);

    const visualizePathfinding = (pathNodes: number[][], visited: Set<string>) => {
        let delay = 0;
        const stepDelay = 40; // delay here for each tile traversed (successfully or not)

        // Convert visited Set to array for visualization
        const visitedArray = Array.from(visited).map((key) => key.split(',').map(Number));

        visitedArray.forEach((node) => {
            setTimeout(() => {
                setVisitedNodes((prev) => [...prev, node]);
            }, delay);
            delay += stepDelay;
        });

        // Mark the final path in green (if found)
        if (pathNodes.length) {
            setTimeout(() => {
                setPath(pathNodes);
            }, delay);
        }
    };

    const findPath = useCallback((grid: string[][], start: [number, number], end: [number, number]) => {
        const {result, visited} = bfs(grid, start, end);
        visualizePathfinding(result, visited);
    }, []);

    return {path, findPath, visitedNodes};
};
