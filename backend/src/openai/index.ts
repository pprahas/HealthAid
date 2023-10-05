import { Router } from "express";
import { AskGPT } from "./controllers/askgpt";

class GPTRoutes {
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/", AskGPT);
  }
}

export default new GPTRoutes().router;
