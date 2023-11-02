import { Router } from "express";
import { getRequest } from "@endpoints/controllers/doctorRequest/getRequest";

class GetRequestRoutes {
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/", getRequest);
  }
}

export default new GetRequestRoutes().router;
