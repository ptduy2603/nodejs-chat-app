const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const { connectDatabase } = require("./src/configs/database");
const appRouting = require("./src/routes");

// create new server
const app = express();

// add plugins and middlewares
app.use(morgan("combined"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// connect to database
connectDatabase(app);

// app routing
appRouting(app);
