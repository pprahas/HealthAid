import { Router } from "express";
import {
  createConversation,
  sendMessage,
  getConversations,
} from "@endpoints/controllers/AI/conversation";
import { AskGPTWrapper } from "@endpoints/controllers/AI/gpt";

class ConversationRoutes {
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/createConversation", createConversation);
    this.router.post("/sendMessage", sendMessage);
    this.router.post("/gpt", AskGPTWrapper);
    this.router.post("/getConversations", getConversations);
  }
}

export default new ConversationRoutes().router;
