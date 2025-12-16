import { Server } from 'socket.io';
import { logger } from '../config/logger.js';

let io;

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: '*'
    }
  });

  io.on('connection', (socket) => {
    socket.on('joinRide', (rideId) => {
      if (!rideId) return;
      socket.join(`ride:${rideId}`);
    });

    socket.on('bid:place', (payload) => {
      if (!payload?.rideId) return;
      io.to(`ride:${payload.rideId}`).emit('bid:placed', {
        ...payload,
        ts: new Date().toISOString()
      });
    });

    socket.on('chat:message', (payload) => {
      const room = payload?.rideId ? `ride:${payload.rideId}` : payload?.room;
      if (!room) return;
      io.to(room).emit('chat:message', {
        ...payload,
        ts: new Date().toISOString()
      });
    });
  });

  logger.info('Socket.io initialized');
  return io;
}

export function getIo() {
  if (!io) throw new Error('Socket not initialized');
  return io;
}
