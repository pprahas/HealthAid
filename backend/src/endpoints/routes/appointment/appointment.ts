import { Router } from "express";
import { createAppointment } from "@endpoints/controllers/appointment/createAppointment";
import { deleteAppointment } from "@endpoints/controllers/appointment/deleteAppointment";
import { editAppointment } from "@endpoints/controllers/appointment/updateAppointment";
class AppointmentRoutes {
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/create", createAppointment);
    this.router.post("/delete", deleteAppointment);
    this.router.post("/edit", editAppointment);
  }
}

export default new AppointmentRoutes().router;
