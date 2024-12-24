export type TileType = 'free' | 'blocked' | 'start' | 'end' | 'path' | 'traversed';
export type AlgorithmType = 'dfs' | 'dijkstra' | 'aStar' | 'bidirectional' | 'bfs';

export interface GridState {
    grid: TileType[][];
}
