import React, { useState, useEffect } from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { motion } from 'framer-motion';

const ControlPanel: React.FC<{
    onStart: () => void;
    onReset: () => void;
    setAlgorithm: (value: string) => void;
    timer: number;
    running: boolean;
}> = ({ onStart, onReset, setAlgorithm, timer, running }) => {
    const handleAlgorithmChange = (event: SelectChangeEvent<string>) => {
        setAlgorithm(event.target.value as string);
    };

    return (
        <Box className="flex flex-col gap-6 p-6 rounded-lg bg-white shadow-lg w-full">
            <h2 className="text-xl font-semibold text-gray-800">Controls</h2>

            <FormControl fullWidth variant="outlined">
                <InputLabel id="algorithm-label" shrink>
                    Algorithm
                </InputLabel>
                <Select
                    labelId="algorithm-label"
                    id="algorithm-select"
                    defaultValue="bfs"
                    onChange={handleAlgorithmChange}
                    label="Algorithm"
                    variant="outlined"
                >
                    <MenuItem value="bfs">Breadth-First Search (BFS)</MenuItem>
                    <MenuItem value="dfs">Depth-First Search (DFS)</MenuItem>
                    <MenuItem value="dijkstra">Dijkstra</MenuItem>
                    <MenuItem value="aStar">A*</MenuItem>
                </Select>
            </FormControl>

            <Box className="flex gap-4 w-full">
                <Button onClick={onReset} variant="outlined" color="secondary" fullWidth>
                    Reset Grid
                </Button>
                <Button onClick={onStart} variant="contained" color="primary" fullWidth>
                    Start Pathfinding
                </Button>
            </Box>

            {/* Timer Display Below Controls */}
            {running || timer > 0 ? (
                <motion.div
                    animate={{
                        scale: running ? 1.3 : 1.7,
                        color: running ? '#dc2626' : '#16a34a',
                    }}
                    transition={{ duration: 0.2 }}
                    className="timer mt-6"
                >
                    {`${(timer / 1000).toFixed(2)} s`}
                </motion.div>
            ) : null}
        </Box>
    );
};

export default ControlPanel;
