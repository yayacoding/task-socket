const express = require("express");
const app = express();
const http = require("http");
require("dotenv").config();
const httpServer = http.createServer(app);
const db = require("./app/models");
const { SocketServer } = require("./app/socket");
const port = process.env.PORT;

SocketServer(httpServer);
httpServer.listen(port, (err, res) => {
  if (err) console.log("TCL: err", err);

  console.log("Server running on ", port);
});

app.use(express.json());
app.use("/", require("./app/route"));
