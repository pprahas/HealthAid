import { Router } from "express";
import { conversation } from "@endpoints/controllers/conversation/createConversation";

class ConversationRoutes {
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/", conversation);
  }
}

export default new ConversationRoutes().router;
