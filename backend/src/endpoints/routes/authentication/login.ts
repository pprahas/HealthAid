import { Router } from "express";
import { login } from "@endpoints/controllers/authentication/login";

class LoginRoutes {
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/", login);
  }
}

export default new LoginRoutes().router;
