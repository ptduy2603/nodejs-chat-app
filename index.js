const express = require("express");
const morgan = require("morgan");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(morgan("combined"));
app.use("/", (req, res) => res.json({ message: "Hello user" }));

app.listen(PORT, () => console.log(`App is running on port ${PORT}`));
