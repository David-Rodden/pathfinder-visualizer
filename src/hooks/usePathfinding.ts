"use client";
import {useCallback, useRef, useState} from 'react';
import {bfs} from "@/lib/pathfinding";

export const usePathfinding = () => {
    const [path, setPath] = useState<number[][]>([]);
    const [visitedNodes, setVisitedNodes] = useState<number[][]>([]);
    const traversalCancelled = useRef(false);
    const timeoutsRef = useRef<NodeJS.Timeout[]>([]);  // Store all timeouts

    const visualizePathfinding = (pathNodes: number[][], visited: Set<string>) => {
        let delay = 0;
        const stepDelay = 15;

        const visitedArray = Array.from(visited).map((key) => key.split(',').map(Number));
        traversalCancelled.current = false;

        // Clear previous timeouts
        timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
        timeoutsRef.current = [];

        // Visualize visited nodes
        visitedArray.forEach((node) => {
            const timeout = setTimeout(() => {
                if (!traversalCancelled.current) setVisitedNodes((prev) => [...prev, node]);
            }, delay);
            timeoutsRef.current.push(timeout);  // Store timeout ID
            delay += stepDelay;
        });

        // Visualize final path (green)
        if (pathNodes.length) {
            const timeout = setTimeout(() => {
                if (!traversalCancelled.current) setPath(pathNodes);
            }, delay);
            timeoutsRef.current.push(timeout);  // Store timeout ID
        }
    };

    const findPath = useCallback(
        (grid: string[][], start: [number, number], end: [number, number], algorithmFn = bfs) => {
            const {result, visited} = algorithmFn(grid, start, end);
            visualizePathfinding(result, visited);
        },
        []
    );

    const cancelTraversal = () => {
        traversalCancelled.current = true;
        setPath([]);
        setVisitedNodes([]);
        // Clear pending timeouts
        timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
        timeoutsRef.current = [];
    };

    return {
        path,
        visitedNodes,
        findPath,
        cancelTraversal,
        setPath,
        setVisitedNodes,
    };
};
