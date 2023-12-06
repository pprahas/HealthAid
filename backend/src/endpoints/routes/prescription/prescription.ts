import { Router } from "express";
import { createPrescription } from "@endpoints/controllers/prescription/createPrescription";
import { getPrescription } from "@endpoints/controllers/prescription/getPrescription";

class PrescriptionRoutes {
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/create", createPrescription);
    this.router.post("/get", getPrescription);
  }
}

export default new PrescriptionRoutes().router;
