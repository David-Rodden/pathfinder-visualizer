export type TileType = 'free' | 'blocked';

export interface GridState {
    grid: TileType[][];
}
