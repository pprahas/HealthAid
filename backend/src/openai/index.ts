import { Router } from "express";
import { AskGPTWrapper } from "./controllers/askgpt";

class GPTRoutes {
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/", AskGPTWrapper);
  }
}

export default new GPTRoutes().router;
