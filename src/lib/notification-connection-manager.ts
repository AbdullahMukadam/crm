class ConnectionManager {
    private connections: Map<string, Set<ReadableStreamDefaultController>> = new Map();

    addConnection(userId: string, controller: ReadableStreamDefaultController) {
        if (!this.connections.has(userId)) {
            this.connections.set(userId, new Set());
        }
        this.connections.get(userId)!.add(controller);
        console.log(`User ${userId} connected. Total connections: ${this.connections.get(userId)!.size}`);
    }

    removeConnection(userId: string, controller: ReadableStreamDefaultController) {
        const userConnections = this.connections.get(userId);
        if (userConnections) {
            userConnections.delete(controller);
            if (userConnections.size === 0) {
                this.connections.delete(userId);
            }
            console.log(`User ${userId} disconnected. Remaining: ${userConnections.size}`);
        }
    }

    broadcast(userId: string, data: any) {
        const userConnections = this.connections.get(userId);
        if (userConnections) {
            const encoder = new TextEncoder();
            const message = `data: ${JSON.stringify(data)}\n\n`;

            userConnections.forEach(controller => {
                try {
                    controller.enqueue(encoder.encode(message));
                } catch (error) {
                    console.error('Error broadcasting to connection:', error);
                    this.removeConnection(userId, controller);
                }
            });
        }
    }

    getUserConnectionCount(userId: string): number {
        return this.connections.get(userId)?.size || 0;
    }

    getAllConnections(): number {
        let total = 0;
        this.connections.forEach(set => total += set.size);
        return total;
    }
}

// Export singleton instance
export const connectionManager = new ConnectionManager();