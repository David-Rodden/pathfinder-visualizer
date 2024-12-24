export type TileType = 'free' | 'blocked' | 'start' | 'end' | 'path' | 'traversed';

export interface GridState {
    grid: TileType[][];
}
