import { Router } from "express";
import { createPrescription } from "@endpoints/controllers/prescription/createPrescription";
import { getPrescription } from "@endpoints/controllers/prescription/getPrescription";
import { updateRequestedRefills } from "@endpoints/controllers/prescription/updateRequestedRefills";
import { updateRequests } from "@endpoints/controllers/prescription/updateRequests";

class PrescriptionRoutes {
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/create", createPrescription);
    this.router.post("/get", getPrescription);
    this.router.post("/requestedRefills", updateRequestedRefills);
    this.router.post("/updateRequests", updateRequests);
  }
}

export default new PrescriptionRoutes().router;
