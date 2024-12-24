'use client';
import { useCallback, useRef, useState } from 'react';
import { bfs } from '@/lib/pathfinding';
import { BidirectionalPathResult, PathResult } from '@/lib/pathfinding/utils';

export const usePathfinding = () => {
    const [path, setPath] = useState<number[][]>([]);
    const [visitedNodes, setVisitedNodes] = useState<number[][]>([]);
    const traversalCancelled = useRef(false);
    const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

    /**
     *  Animate visited nodes + final path
     */
    const visualizePathfinding = (
        pathNodes: number[][],
        visitedStart: Set<string>,
        visitedEnd?: Set<string>,
        resolve?: () => void,
    ) => {
        let delay = 0;
        const stepDelay = 15;
        let lastTimeout: NodeJS.Timeout | null = null;

        const toArray = (set: Set<string>) => Array.from(set).map(k => k.split(',').map(Number));

        const visitedArrayStart = toArray(visitedStart);
        const visitedArrayEnd = visitedEnd ? toArray(visitedEnd) : [];

        // Clear any old timeouts
        traversalCancelled.current = false;
        timeoutsRef.current.forEach(clearTimeout);
        timeoutsRef.current = [];

        // Animate visited nodes
        const maxLen = Math.max(visitedArrayStart.length, visitedArrayEnd.length);
        for (let i = 0; i < maxLen; i++) {
            [visitedArrayStart[i], visitedArrayEnd[i]].forEach(node => {
                if (node) {
                    timeoutsRef.current.push(
                        setTimeout(() => {
                            if (!traversalCancelled.current) {
                                setVisitedNodes(prev => [...prev, node]);
                            }
                        }, delay),
                    );
                }
            });
            delay += stepDelay;
        }

        // Animate path last + resolve if applicable
        if (pathNodes.length) {
            lastTimeout = setTimeout(() => {
                if (!traversalCancelled.current) {
                    setPath(pathNodes);
                    if (resolve) resolve();
                }
            }, delay);
            timeoutsRef.current.push(lastTimeout);
        } else {
            // Resolve immediately if no path is found
            if (resolve) resolve();
        }
    };

    /**
     *  Run pathfinding + wait for animations
     */
    const findPath = useCallback(
        (grid: string[][], start: [number, number], end: [number, number], algorithmFn = bfs) =>
            new Promise<void>(resolve => {
                const result = algorithmFn(grid, start, end);
                const {
                    visitedStart,
                    visitedEnd,
                    visited,
                    result: pathResult,
                } = result as BidirectionalPathResult & PathResult;

                // Directly use visualizePathfinding and pass the resolve callback
                visualizePathfinding(pathResult, visitedStart ?? visited, visitedEnd, resolve);
            }),
        [],
    );

    /**
     *  Cancel any ongoing traversal
     */
    const cancelTraversal = () => {
        traversalCancelled.current = true;
        setPath([]);
        setVisitedNodes([]);
        timeoutsRef.current.forEach(clearTimeout);
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
