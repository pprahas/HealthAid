import { Router } from "express";
import { createConversation, sendMessage } from "@endpoints/controllers/AI/conversation";

class ConversationRoutes {
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/createConversation", createConversation);
    this.router.post("/sendMessage", sendMessage);
  }
}

export default new ConversationRoutes().router;
