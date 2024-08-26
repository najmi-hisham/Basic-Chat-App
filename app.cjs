const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => { //When someone enter url
  console.log("A user is connected");

  socket.on('set username', (username) => {// Get user name
      socket.username = username;
      console.log(`${username} has joined the chat`); // EventEmitter : set username
  });

  socket.on('chat message', (data) => { //dialogue
      console.log(`${data.name} says: ${data.message}`);
      io.emit('chat message', data); // EventEmitter : chat message
  });

  socket.on("disconnect", () => { //When a user disconnected
      if (socket.username) {
          console.log(`${socket.username} is disconnected`);
          io.emit('user disconnect', socket.username); // Notify all clients
      } else {
          console.log("An unnamed user is disconnected");
      }
  });// EventEmitter : "disconnect"
});


server.listen(3000, () => {
  console.log('listening on *:3000');
});
