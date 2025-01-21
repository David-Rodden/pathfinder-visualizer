import { WeightedSearch } from './WeightedSearch';
import { GridType, heuristic } from './utils';

export class AStarSearch extends WeightedSearch {
    constructor(grid: GridType) {
        super(grid, heuristic); // Use the Manhattan distance heuristic
    }
}
