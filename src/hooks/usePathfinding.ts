"use client";
import {useCallback, useRef, useState} from 'react';
import {bfs} from "@/lib/pathfinding";
import {BidirectionalPathResult, PathResult} from '@/lib/pathfinding/utils';

export const usePathfinding = () => {
    const [path, setPath] = useState<number[][]>([]);
    const [visitedNodes, setVisitedNodes] = useState<number[][]>([]);
    const traversalCancelled = useRef(false);
    const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

    const visualizePathfinding = (
        pathNodes: number[][],
        visitedStart: Set<string>,
        visitedEnd?: Set<string>
    ) => {
        let delay = 0;
        const stepDelay = 15;

        const visitedArrayStart = Array.from(visitedStart).map((key) => key.split(',').map(Number));
        const visitedArrayEnd = visitedEnd ? Array.from(visitedEnd).map((key) => key.split(',').map(Number)) : [];

        traversalCancelled.current = false;

        // Clear previous timeouts
        timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
        timeoutsRef.current = [];

        // Interleave visualization for start and end nodes
        const maxLen = Math.max(visitedArrayStart.length, visitedArrayEnd.length);
        for (let i = 0; i < maxLen; i++) {
            if (i < visitedArrayStart.length) {
                const timeout = setTimeout(() => {
                    if (!traversalCancelled.current) {
                        setVisitedNodes((prev) => [...prev, visitedArrayStart[i]]);
                    }
                }, delay);
                timeoutsRef.current.push(timeout);
            }

            if (i < visitedArrayEnd.length) {
                const timeout = setTimeout(() => {
                    if (!traversalCancelled.current) {
                        setVisitedNodes((prev) => [...prev, visitedArrayEnd[i]]);
                    }
                }, delay);
                timeoutsRef.current.push(timeout);
            }

            delay += stepDelay;
        }

        // Visualize final path
        if (pathNodes.length) {
            const timeout = setTimeout(() => {
                if (!traversalCancelled.current) setPath(pathNodes);
            }, delay);
            timeoutsRef.current.push(timeout);
        }
    };

    const findPath = useCallback(
        async (
            grid: string[][],
            start: [number, number],
            end: [number, number],
            algorithmFn = bfs
        ) => {
            return new Promise<void>((resolve) => {
                const result = algorithmFn(grid, start, end);

                // Type Narrowing for BidirectionalPathResult
                if ('visitedStart' in result && 'visitedEnd' in result) {
                    const {visitedStart, visitedEnd, result: pathResult} = result as BidirectionalPathResult;

                    visualizePathfinding(pathResult, visitedStart, visitedEnd);

                    // Resolve immediately if the path is found (for bidirectional)
                    if (pathResult.length) {
                        resolve();
                    }
                } else {
                    const {visited, result: pathResult} = result as PathResult;

                    visualizePathfinding(pathResult, visited);
                }

                setTimeout(resolve, result.result.length ? result.visited.size * 15 : 0);
            });
        },
        []
    );

    const cancelTraversal = () => {
        traversalCancelled.current = true;
        setPath([]);
        setVisitedNodes([]);
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
