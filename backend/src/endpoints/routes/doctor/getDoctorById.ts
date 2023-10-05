import { Router } from "express";
import { getDoctorByIdController } from "@endpoints/controllers/doctor/getDoctorById";

class getDoctorFromId {
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/", getDoctorByIdController);
  }
}

export default new getDoctorFromId().router;
