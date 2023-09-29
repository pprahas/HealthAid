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
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    senderType: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Database Model
export const MessageDTO = model("Message", messageSchema);
