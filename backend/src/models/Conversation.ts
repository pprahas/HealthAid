import { Schema, model } from "mongoose";
import { Message } from "./Message";
import { Diagnosis } from "./Diagnosis";

// Local Model
export type Conversation = {
  doctor: String;
  patient: String;
  messages?: [Message];
  diagnosis?: Diagnosis;
};
[]
export const conversationSchema = new Schema(
  {
    doctor: {
      type: String,
    },
    patient: {
      type: String,
    },
    messages: {
      type: [{ type: Schema.ObjectId, ref: "Message" }],
    },
    diagnosis: {
      type: { type: Schema.ObjectId, ref: "Diagnosis" },
    },
  },
  { timestamps: true }
);

// Database Model
export const ConversationDTO = model("Conversation", conversationSchema);
