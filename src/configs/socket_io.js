const { Server } = require("socket.io");
const { CLIENT_DOMAIN } = require("../constants");

const configSocketIo = (server) => {
  const io = new Server(server, {
    cors: {
      origin: CLIENT_DOMAIN,
      methods: ["GET", "POST"],
    },
  });

  // config socket.io
  io.on("connection", (socket) => {
    console.log("A new client connects with ID = " + socket?.id);

    socket.emit("greet", "Welcome to my website!");

    socket.on("chat", (message) => {
      console.log("New message: " + message);
    });
  });
};

module.exports = configSocketIo;
