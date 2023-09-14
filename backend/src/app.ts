// import required libraries and modules
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from "dotenv";
import path from "path";


const envPath = path.resolve(__dirname, `config/.env`);
dotenv.config({ path: envPath });

// create an instance of express
const app = express();
app.use(express.json());

// connect to MongoDB
const uri = process.env.MONGODB_CONNECTION_STRING
mongoose
  .connect(uri)
  .then(() => console.log("HealthAid db connection established"))
  .catch((err) => console.log("HealthAid db connection not established"));

// middleware setup
app.use(morgan("dev"));
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// routes
// listen on port
const port = 3001;
app.listen(port, () => {
  console.log("App is listening at port 3001");
});
