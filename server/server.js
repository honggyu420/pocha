const express = require("express");
const http = require("http");
const socketIo = require("socket.io")
var path = require("path")
var uuid = require('uuid-random');
const { uniqueNamesGenerator, adjectives, colors, animals, names } = require('unique-names-generator');

const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();

app.use(index);

const server = http.createServer(app);

app.use(express.urlencoded({extended: true}));
app.use(express.json()) // To parse the incoming requests with JSON payloads

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


// const io = socketIo(server, {
//   cors: {
//     origin: "client",
//     methods: ["GET", "POST"],
//     credentials: true
//   }
// });
const io = socketIo(server);

const getApiAndEmit = socket => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  socket.emit("FromAPI", response);
};

var chat_room_data = []
var connected_clients = {}

function sendUpdatedChatRoomData(client){
  client.emit("RetrieveChatRoomData", chat_room_data)
  client.broadcast.emit("RetrieveChatRoomData", chat_room_data)
}

io.on("connection", (client) => {
  console.log("New client connected");

  client.on("SendMessage", (message_data) => {
    console.log("Message received: " + message_data);
    chat_room_data.push(message_data)
    sendUpdatedChatRoomData(client)
  });

  client.on("UserEnteredRoom", (user_data) => {
    var entered_room_message = {
      message: `${user_data.username} has entered the chat`,
      username: "",
      user_id: 0,
      timsteamp: null,
    }
    chat_room_data.push(entered_room_message)
    sendUpdatedChatRoomData(client)
    connected_clients[client.id] = user_data

  });

  //Creating identity for new connected user
  client.on("CreateUserData", () => {
    let user_id = uuid();
    let username = uniqueNamesGenerator({ dictionaries: [adjectives, names] });
    var user_data = {user_id, username}

    client.emit("SetUserData", user_data)
  })
  
  client.on("disconnecting", (data) => {
    console.log("Client disconnected");
  
    if(connected_clients[client.id]) {
      var left_room_message = {
        message: `${connected_clients[client.id].username} has left the chat`,
        username: "",
        user_id: 0,
        timestamp: null,
      }
  
      chat_room_data.push(left_room_message)
      sendUpdatedChatRoomData(client)
      delete connected_clients[client.id]
    }
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));