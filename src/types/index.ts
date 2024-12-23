export type TileType = 'free' | 'blocked' | 'start' | 'end';

export interface GridState {
    grid: TileType[][];
}
