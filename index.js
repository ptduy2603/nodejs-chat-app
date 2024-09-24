const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
require("dotenv").config();
const { connectDatabase } = require("./src/configs/database");
const appRouting = require("./src/routes");
const configSocketIo = require("./src/configs/socket_io");

// create socket.io server and nodeJS server
const app = express();
const server = http.createServer(app);

// add plugins and middlewares
app.use(morgan("combined"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// config socket.io server
configSocketIo(server);

// connect to database
connectDatabase(server);

// app routing
appRouting(app);
