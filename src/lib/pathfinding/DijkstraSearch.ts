import { WeightedSearch } from './WeightedSearch';
import { GridType } from './utils';

export class DijkstraSearch extends WeightedSearch {
    constructor(grid: GridType) {
        super(grid, () => 0); // No-op heuristic
    }
}
