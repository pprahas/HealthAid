import { Router } from "express";
import { register } from "@endpoints/controllers/authentication/register";

class RegisterRoutes {
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/", register);
  }
}

export default new RegisterRoutes().router;
