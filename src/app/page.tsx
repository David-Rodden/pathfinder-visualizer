"use client";
import Grid from '../components/Grid';
import ControlPanel from '../components/ControlPanel';
import React, {useRef, useState} from 'react';

export default function Home() {
    const [algorithm, setAlgorithm] = useState('bfs');
    const gridRef = useRef<{ findPath: () => void, resetGrid: () => void } | null>(null);
    const [timer, setTimer] = useState(0);
    const [running, setRunning] = useState(false);

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
        setAlgorithm(value);
        setTimer(0);  // Reset timer when changing algorithm
        setRunning(false);  // Stop showing the running state
        gridRef.current?.resetGrid();
    };

    return (
        <main className="flex flex-col lg:flex-row justify-center items-start min-h-screen p-10 bg-gray-900 text-white">
            <div className="flex items-start gap-8 w-full">
                <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-6 text-center">Pathfinding Visualizer</h1>
                    <Grid ref={gridRef} algorithm={algorithm} setTimer={setTimer} setRunning={setRunning}/>
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
