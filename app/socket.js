const { Server } = require("socket.io");

let io;
const SocketServer = (httpServer) => {
  io = new Server(httpServer);
  io.on("connection", (socket) => {
    console.log("TCL: SocketServer -> connection", socket.id);
    io.emit("message", "Welcome to the Socket.IO server!", socket.id);

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

module.exports = {
  SocketServer,
  getIo: () => io,
};
