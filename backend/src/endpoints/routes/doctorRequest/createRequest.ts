import { Router } from "express";
import { createRequest } from "@endpoints/controllers/doctorRequest/createRequest";

class CreateRequestRoutes {
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/", createRequest);
  }
}

export default new CreateRequestRoutes().router;
