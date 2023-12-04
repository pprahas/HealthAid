import { Router } from "express";
import {
  createConversation,
  sendMessage,
  getConversations,
  sendMessageDoc,
  markAsSeen,
  sendMessagePat
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
    this.router.post("/sendMessageDoc", sendMessageDoc);
    this.router.post("/sendMessagePat", sendMessagePat);
    this.router.post("/gpt", AskGPTWrapper);
    this.router.post("/getConversations", getConversations);
    this.router.post("/markAsSeen", markAsSeen)
  }
}

export default new ConversationRoutes().router;
