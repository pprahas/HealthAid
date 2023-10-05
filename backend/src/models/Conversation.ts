import { Schema, model } from "mongoose";
import { Message } from "./Message";
import { Diagnosis } from "./Diagnosis";

// Local Model
export type Conversation = {
  doctor?: String;
  patient: String;
  messages?: [Message];
  diagnosis?: Diagnosis;
};
[]
export const conversationSchema = new Schema(
  {
    doctor: {
      type: { type: Schema.ObjectId, ref: "Doctor" },
    },
    patient: {
      type: { type: Schema.ObjectId, ref: "Patient" },
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
