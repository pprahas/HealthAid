import { Router } from "express";
import { getDoctorByIdController } from "@endpoints/controllers/doctor/getDoctorById";
import { getDoctors } from "@endpoints/controllers/doctor/getDoctors";

class getDoctorFromId {
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/", getDoctorByIdController);
    this.router.post("/all", getDoctors);
  }
}

export default new getDoctorFromId().router;
