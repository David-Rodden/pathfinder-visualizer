import React from 'react';
import {Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from '@mui/material';

const ControlPanel: React.FC<{
    onStart: () => void;
    onReset: () => void;
    setAlgorithm: (value: string) => void;
}> = ({onStart, onReset, setAlgorithm}) => {
    const handleAlgorithmChange = (event: SelectChangeEvent<string>) => {
        setAlgorithm(event.target.value as string);
    };

    return (
        <Box className="flex flex-col gap-6 p-6 rounded-lg bg-white shadow-lg w-full">
            <h2 className="text-xl font-semibold text-gray-800">Controls</h2>

            {/* FormControl with proper label linking */}
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
        </Box>
    );
};

export default ControlPanel;
