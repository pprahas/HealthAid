import { Router } from "express";
import { getClinic } from "@endpoints/controllers/extraInformation/getClinic";

class GetClinic {
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/", getClinic);
  }
}
export default new GetClinic().router;
