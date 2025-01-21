import React, { useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Switch,
    Typography,
} from '@mui/material';
import { motion } from 'framer-motion';

const ControlPanel: React.FC<{
    onStart: () => void;
    onReset: () => void;
    setAlgorithm: (value: string) => void;
    setBidirectional: (value: boolean) => void;
    timer: number;
    running: boolean;
}> = ({ onStart, onReset, setAlgorithm, setBidirectional, timer, running }) => {
    const [bidirectional, setLocalBidirectional] = useState(false);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('bfs');

    const handleAlgorithmChange = (event: SelectChangeEvent) => {
        const newAlgorithm = event.target.value as string;
        setSelectedAlgorithm(newAlgorithm);
        setAlgorithm(newAlgorithm);
    };

    const toggleBidirectional = () => {
        const newState = !bidirectional;
        setLocalBidirectional(newState);
        setBidirectional(newState);
    };

    const formatTimer = (milliseconds: number) => {
        const seconds = Math.floor(milliseconds / 1000);
        const centiseconds = Math.floor((milliseconds % 1000) / 10);
        return `${seconds}:${centiseconds.toString().padStart(2, '0')}`;
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
                    value={selectedAlgorithm}
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

            <Box className="flex items-center gap-2">
                <Switch checked={bidirectional} onChange={toggleBidirectional} />
                <Typography variant="body1" className="text-gray-700">
                    Bidirectional Pathing
                </Typography>
            </Box>

            <Box className="flex gap-4 w-full">
                <Button onClick={onReset} variant="outlined" color="secondary" fullWidth>
                    Reset Grid
                </Button>
                <Button onClick={onStart} variant="contained" color="primary" fullWidth>
                    Start Pathfinding
                </Button>
            </Box>

            {running || timer > 0 ? (
                <motion.div
                    animate={{
                        scale: running ? 1.3 : 1.7,
                        color: running ? '#dc2626' : '#16a34a',
                    }}
                    transition={{ duration: 0.2 }}
                    className="timer mt-6"
                    style={{
                        fontFamily: 'Poppins, sans-serif',
                        letterSpacing: '0.1rem',
                        fontSize: '2rem',
                        width: '8rem',
                        textAlign: 'center',
                    }}
                >
                    {formatTimer(timer)}
                </motion.div>
            ) : null}
        </Box>
    );
};

export default ControlPanel;
