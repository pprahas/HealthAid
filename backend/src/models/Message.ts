import { Schema, model } from "mongoose";

// Local Model
export interface Message {
  senderType: String;
  content: String;
};

export const messageSchema = new Schema(
  {
    senderType: {
      type: String,
    },
    content: {
      type: String,
    },
    seen: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  { timestamps: true }
);

// Database Model
export const MessageDTO = model("Message", messageSchema);
