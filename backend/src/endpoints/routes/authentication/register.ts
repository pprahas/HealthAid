import { Router } from "express";
import { register } from "@endpoints/controllers/authentication/register";

class RegisterRoutes {
  router = Router();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.post("/", register);
  }
}

export default new RegisterRoutes().router;