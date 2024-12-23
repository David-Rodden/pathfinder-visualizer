"use client";
import Grid from '../components/Grid';
import ControlPanel from '../components/ControlPanel';

export default function Home() {
    return (
        <main className="flex flex-col items-center min-h-screen">
            <h1 className="text-3xl font-bold mt-10">Pathfinding Visualizer</h1>
            <Grid />
            <ControlPanel onReset={() => window.location.reload()} />
        </main>
    );
}
