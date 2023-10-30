import { Router } from "express";
import { createAppointment } from "@endpoints/controllers/appointment/createAppointment";

class AppointmentRoutes {
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/create", createAppointment);
    // this.router.post("/create", createAppointment);
  }
}

export default new AppointmentRoutes().router;
