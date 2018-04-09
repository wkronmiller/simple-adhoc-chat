import express from 'express';
import proxy from 'http-proxy-middleware';
import { Server } from 'http';
import IO from 'socket.io';

const app = express();
const server = Server(app);
const io = IO(server);

const subscribers = {};

io.on('connection', socket => {
  console.log('Connected', socket.id);
  subscribers[socket.id] = socket;
  socket.on('disconnect', () => {
    console.log('Disconnected', socket.id);
    delete subscribers[socket.id];
  });
  socket.emit('message', { sender: 'Server', message: 'Welcome!' });
  socket.on('message',  message => {
    Object.keys(subscribers).forEach(id => subscribers[id].emit('message', { sender: socket.id, message }));
  });
});

server.listen(8080, () => console.log('listening'));
