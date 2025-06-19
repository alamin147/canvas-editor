import { Server } from 'http';
import mongoose from 'mongoose';
import { Server as SocketServer } from 'socket.io';
import app from './app';
import config from './app/config';

let server: Server;
let io: SocketServer;

const activeUsers = new Map();
const roomUsers = new Map();

async function main() {
  try {
    await mongoose.connect(config.database_url as string);

    server = app.listen(config.port, () => {
      // eslint-disable-next-line no-console
      console.log(`app is listening on port ${config.port}`);
    });

    // Initialize Socket.io
    io = new SocketServer(server, {
      cors: app.get('corsConfig'),
    });

    // Socket.io connection handler
    io.on('connection', (socket) => {
      console.log('A user connected', socket.id);

      // Handle user joining a canvas project
      socket.on('join-canvas', ({ projectId, userId, username, userColor }) => {
        socket.join(projectId);

        // Store user data
        const userData = {
          socketId: socket.id,
          userId,
          username,
          userColor,
          mousePosition: { x: 0, y: 0 },
        };

        activeUsers.set(socket.id, userData);

        // Add user to room
        if (!roomUsers.has(projectId)) {
          roomUsers.set(projectId, new Map());
        }
        roomUsers.get(projectId).set(socket.id, userData);

        // Broadcast to other users in the same room that someone joined
        socket.to(projectId).emit('user-joined', userData);

        // Send list of current users to the new user
        const usersInRoom = Array.from(roomUsers.get(projectId).values());
        socket.emit('active-users', usersInRoom);

        console.log(
          `User ${username} (${socket.id}) joined canvas ${projectId}`,
        );
      });

      // Handle mouse movement
      socket.on('mouse-move', ({ projectId, position }) => {
        const userData = activeUsers.get(socket.id);
        if (userData) {
          userData.mousePosition = position;
          socket.to(projectId).emit('user-mouse-move', {
            socketId: socket.id,
            position,
          });
        }
      });

      // Handle canvas object updates
      socket.on(
        'canvas-update',
        ({ projectId, operation, object, objectId }) => {
          // Update the active object being edited by this user
          const userData = activeUsers.get(socket.id);
          if (userData) {
            userData.activeObjectId = operation === 'remove' ? null : objectId;
          }

          // Broadcast update to all clients in the room except sender
          socket.to(projectId).emit('canvas-update', {
            socketId: socket.id,
            userId: activeUsers.get(socket.id)?.userId,
            operation, // 'add', 'modify', 'delete'
            object,
            objectId,
          });
        },
      );

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log('User disconnected', socket.id);

        // Find which rooms this user was in
        for (const [projectId, users] of roomUsers.entries()) {
          if (users.has(socket.id)) {
            // Notify others in the room that user left
            socket.to(projectId).emit('user-left', { socketId: socket.id });

            // Remove user from room
            users.delete(socket.id);

            // If room is empty, remove it
            if (users.size === 0) {
              roomUsers.delete(projectId);
            }

            console.log(`User ${socket.id} left canvas ${projectId}`);
          }
        }

        // Remove from active users
        activeUsers.delete(socket.id);
      });
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
}

main();

process.on('unhandledRejection', () => {
  // eslint-disable-next-line no-console
  console.log(`😈 unahandledRejection is detected , shutting down ...`);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on('uncaughtException', () => {
  // eslint-disable-next-line no-console
  console.log(`😈 uncaughtException is detected , shutting down ...`);
  process.exit(1);
});
