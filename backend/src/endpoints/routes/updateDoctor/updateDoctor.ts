import { Router } from "express";
import { updateDoctor } from "@endpoints/controllers/updateDoctor/updateDoctor";

class UpdateDoctorRoutes {
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/", updateDoctor);
  }
}

export default new UpdateDoctorRoutes().router;
