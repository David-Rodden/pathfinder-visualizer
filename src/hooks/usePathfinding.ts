'use client';
import { useCallback, useRef, useState } from 'react';
import { bfs } from '@/lib/pathfinding';
import { BidirectionalPathResult, PathResult } from '@/lib/pathfinding/utils';

export const usePathfinding = () => {
    const [path, setPath] = useState<number[][]>([]);
    const [visitedNodes, setVisitedNodes] = useState<number[][]>([]);
    const traversalCancelled = useRef(false);
    const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

    const visualizePathfinding = (pathNodes: number[][], visitedStart: Set<string>, visitedEnd?: Set<string>) => {
        let delay = 0;
        const stepDelay = 15;
        const toArray = (set: Set<string>) => Array.from(set).map(k => k.split(',').map(Number));
        const visitedArrayStart = toArray(visitedStart),
            visitedArrayEnd = visitedEnd ? toArray(visitedEnd) : [];

        traversalCancelled.current = false;
        timeoutsRef.current.forEach(clearTimeout);
        timeoutsRef.current = [];

        [...Array(Math.max(visitedArrayStart.length, visitedArrayEnd.length))].forEach((_, i) => {
            [visitedArrayStart[i], visitedArrayEnd[i]].forEach(node => {
                if (node) {
                    timeoutsRef.current.push(
                        setTimeout(() => {
                            if (!traversalCancelled.current) setVisitedNodes(prev => [...prev, node]);
                        }, delay),
                    );
                }
            });
            delay += stepDelay;
        });

        if (pathNodes.length) {
            timeoutsRef.current.push(
                setTimeout(() => {
                    if (!traversalCancelled.current) setPath(pathNodes);
                }, delay),
            );
        }
    };

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

                visualizePathfinding(pathResult, visitedStart ?? visited, visitedEnd);
                const maxVisited = Math.max(visitedStart?.size || 0, visitedEnd?.size || 0, visited?.size || 0);
                setTimeout(resolve, pathResult.length ? maxVisited * 15 : 0);
            }),
        [],
    );

    const cancelTraversal = () => {
        traversalCancelled.current = true;
        setPath([]);
        setVisitedNodes([]);
        timeoutsRef.current.forEach(clearTimeout);
        timeoutsRef.current = [];
    };

    return { path, visitedNodes, findPath, cancelTraversal, setPath, setVisitedNodes };
};
