import { Router } from "express";
import { createConversation, sendMessage } from "@endpoints/controllers/AI/conversation";
import { AskGPTWrapper } from "@endpoints/controllers/AI/gpt";

class ConversationRoutes {
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/createConversation", createConversation);
    this.router.post("/sendMessage", sendMessage);
    this.router.post("/gpt", AskGPTWrapper)
  }
}

export default new ConversationRoutes().router;
