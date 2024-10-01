const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

const { CLIENT_DOMAIN } = require("./src/constants");
const http = require("http");
const configSocketIo = require("./src/configs/socket_io");
const appRouting = require("./src/routes");
const { connectDatabase } = require("./src/configs/database");

// create socket.io server and nodeJS server
const app = express();
const server = http.createServer(app);

// add plugins and middlewares
app.use(morgan("combined"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: CLIENT_DOMAIN,
    credentials: true,
  })
);

// config socket.io server
configSocketIo(server);

// connect to database
connectDatabase(server);

// app routing
appRouting(app);
