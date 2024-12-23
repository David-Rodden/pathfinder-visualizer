"use client";
import Grid from '../components/Grid';
import ControlPanel from '../components/ControlPanel';
import React, {useRef, useState} from 'react';

export default function Home() {
    const [algorithm, setAlgorithm] = useState('bfs');
    const gridRef = useRef<{ findPath: () => void, resetGrid: () => void } | null>(null);

    const handleReset = () => {
        gridRef.current?.resetGrid();  // Reset the grid directly without reloading
    };

    const handleStart = () => {
        console.log(`Starting with algorithm: ${algorithm}`);
        gridRef.current?.findPath();
    };

    const handleAlgorithmChange = (value: string) => {
        setAlgorithm(value);
        gridRef.current?.resetGrid();  // Reset the grid and stop traversal
    };

    return (
        <main className="flex flex-col lg:flex-row justify-center items-start min-h-screen p-10 bg-gray-900 text-white">
            <div className="flex items-start gap-8 w-full">
                <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-6 text-center">Pathfinding Visualizer</h1>
                    <Grid ref={gridRef} algorithm={algorithm}/>
                </div>

                <div className="w-full lg:w-72">
                    <ControlPanel
                        onReset={handleReset}
                        onStart={handleStart}
                        setAlgorithm={handleAlgorithmChange}
                    />
                </div>
            </div>
        </main>
    );
}
