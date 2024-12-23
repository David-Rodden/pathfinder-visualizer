export class PriorityQueue<T> {
    private data: { item: T; priority: number }[] = [];

    enqueue(item: T, priority: number): void {
        this.data.push({item, priority});
        this.data.sort((a, b) => a.priority - b.priority);
    }

    dequeue(): T | undefined {
        return this.data.shift()?.item;
    }

    isEmpty(): boolean {
        return this.data.length === 0;
    }
}
