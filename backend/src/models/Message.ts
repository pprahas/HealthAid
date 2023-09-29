import { Schema, model } from "mongoose";

// Local Model
export type Message = {
  messageId: String;
  date: Date;
  senderType: String;
  content: String;
};

export const messageSchema = new Schema(
  {
    messageId: {
      type: String,
    },
    date: {
      type: Date,
    },
    senderType: {
      type: String,
    },
    content: {
      type: String,
    },
  },
  { timestamps: true }
);

// Database Model
export const MessageDTO = model("Message", messageSchema);
