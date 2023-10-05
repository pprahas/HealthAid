import { Router } from "express";
import { resetPassword } from "@endpoints/controllers/authentication/resetPassword";

class LoginRoutes {
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/", resetPassword);
  }
}

export default new LoginRoutes().router;
