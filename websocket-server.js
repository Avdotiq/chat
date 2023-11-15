const WebSocket = require('ws');
const http = require('http');

const server = http.createServer();
const wss = new WebSocket.Server({ noServer: true });

const clients = new Map(); // Map to store WebSocket connections by user id

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        try {
            const { userId, targetUserId, content } = JSON.parse(message);

            if (userId && content) {
                console.log(`Received message from user ${userId} to user ${targetUserId}: ${content}`);

                // Broadcast the message to all connected clients except the sender
                clients.forEach((client, clientId) => {
                    if (clientId !== userId && client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({ senderId: userId, receiverId: targetUserId, content }));
                    }
                });
            }
        } catch (error) {
            console.error('Invalid message format:', message);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');

        // Remove the client from the map on disconnect
        clients.forEach((client, clientId) => {
            if (client === ws) {
                clients.delete(clientId);
            }
        });
    });
});

server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        const userId = request.url.split('/').pop(); // Extract user id from the URL
        clients.set(userId, ws); // Store the WebSocket connection in the map
        wss.emit('connection', ws, request);
    });
});

const PORT = 3030;

server.listen(PORT, () => {
    console.log(`WebSocket server is listening on port ${PORT}`);
});
