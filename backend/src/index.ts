import "module-alias/register";
import express, { Application } from "express";
import cors, { CorsOptions } from "cors";
import Routes from "./endpoints/routes";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import connectToDatabase from "@database/index";

class Server {
  constructor(app: Application) {
    this.config(app);
    new Routes(app);
  }

  private config(app: Application): void {
    const corsOptions: CorsOptions = {
      origin: "http://localhost:8081",
    };

    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
  }
}

const envPath = path.resolve(__dirname, `config/.env`);
dotenv.config({ path: envPath });

// create an instance of express
const app: Application = express();
const server: Server = new Server(app);
const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;

// connect to MongoDB
connectToDatabase();

// middleware setup
app.use(morgan("dev"));
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app
  .listen(PORT, "localhost", function () {
    console.log(`Server is running on port ${PORT}.`);
    console.log(`Server: ${server}`);
  })
  .on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
      console.log("Error: address already in use");
    } else {
      console.log(err);
    }
  });
