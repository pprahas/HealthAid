import { Router } from "express";
import { createAppointment } from "@endpoints/controllers/appointment/createAppointment";
import { deleteAppointment } from "@endpoints/controllers/appointment/deleteAppointment";

class AppointmentRoutes {
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/create", createAppointment);
    this.router.post("/delete", deleteAppointment);
  }
}

export default new AppointmentRoutes().router;
