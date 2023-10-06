import { Schema, model } from "mongoose";
import { Message } from "./Message";
// import { Diagnosis } from "./Diagnosis";

// Local Model
export type Conversation = {
  doctor: String;
  patient: String;
  messages?: Message[];
  diagnosis?: String;
};
[];
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
      type: String,
    },
  },
  { timestamps: true }
);

// Database Model
export const ConversationDTO = model("Conversation", conversationSchema);
