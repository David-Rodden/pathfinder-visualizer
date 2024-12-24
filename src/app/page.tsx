'use client';
import Grid from '../components/Grid';
import ControlPanel from '../components/ControlPanel';
import React, { useEffect, useRef, useState } from 'react';
import { AlgorithmType } from '@/types';

interface GridHandle {
    findPath: () => void;
    resetGrid: () => void;
    timerInterval?: NodeJS.Timeout | null;
}

export default function Home() {
    const [algorithm, setAlgorithm] = useState<AlgorithmType>('bfs');
    const gridRef = useRef<GridHandle | null>(null);
    const [timer, setTimer] = useState(0);
    const [running, setRunning] = useState(false);

    // Suppress React 19 ref warning
    useEffect(() => {
        const originalError = console.error;
        console.error = (...args) => {
            if (typeof args[0] === 'string' && args[0].includes('Accessing element.ref was removed in React 19')) {
                return; // Suppress this warning only
            }
            originalError(...args);
        };

        return () => {
            console.error = originalError;
        };
    }, []);

    const handleReset = () => {
        gridRef.current?.resetGrid();
        setTimer(0);
        setRunning(false);
    };

    const handleStart = () => {
        setTimer(0);
        setRunning(true);
        gridRef.current?.findPath();
    };

    const handleAlgorithmChange = (value: string) => {
        if (value as AlgorithmType) {
            setAlgorithm(value as AlgorithmType);
            setTimer(0);
            setRunning(false);
            gridRef.current?.resetGrid();
            if (gridRef.current?.timerInterval) clearInterval(gridRef.current.timerInterval);
        } else console.warn(`Invalid algorithm selected: ${value}`);
    };

    return (
        <main className="flex flex-col lg:flex-row justify-center items-start min-h-screen p-10 bg-gray-900 text-white">
            <div className="flex items-start gap-8 w-full">
                <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-6 text-center">Pathfinding Visualizer</h1>
                    <Grid ref={gridRef} algorithm={algorithm} setTimer={setTimer} setRunning={setRunning} />
                </div>

                <div className="w-full lg:w-72">
                    <ControlPanel
                        onReset={handleReset}
                        onStart={handleStart}
                        setAlgorithm={handleAlgorithmChange}
                        timer={timer}
                        running={running}
                    />
                </div>
            </div>
        </main>
    );
}
