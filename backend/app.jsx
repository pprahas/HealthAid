const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

const port = 3001;
const uri = process.env.MONGODB_CONNECTION_STRING;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("HealthAid db connection established");
});

app.listen(port, () => {
  console.log("App is listening at port 3001");
});
