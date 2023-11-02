import { Router } from "express";
import { reviewRequest } from "@endpoints/controllers/doctorRequest/reviewRequest";

class ReviewRequestRoutes {
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/", reviewRequest);
  }
}

export default new ReviewRequestRoutes().router;
