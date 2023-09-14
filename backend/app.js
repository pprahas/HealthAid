// import required libraries and modules
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");

// create an instance of express
const app = express();
app.use(express.json());

// connect to MongoDB
const uri = process.env.MONGODB_CONNECTION_STRING;
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("HealthAid db connection established"))
  .catch((err) => console.log("HealthAid db connection not established"));

// middleware setup
app.use(morgan("dev"));
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// routes
const loginRoutes = require("./routes/authentication/login");
app.use("/login", loginRoutes);

// listen on port
const port = 3001;
app.listen(port, () => {
  console.log("App is listening at port 3001");
});
