import { Router } from "express";
import { updateDiagnosis } from "@endpoints/controllers/doctor/updateDiagnosis";

class DiagnosisRoutes {
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/", updateDiagnosis);
  }
}

export default new DiagnosisRoutes().router;
