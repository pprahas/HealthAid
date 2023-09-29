import { Schema, model } from "mongoose";

// Local Model
export type Conversation = {
  conversationId: String;
  title: String;
  date: Date;
  doctorName: String;
  patientName: String;
  content: [any];
  diagnosis: any;
};

export const conversationSchema = new Schema(
  {
    conversationId: {
      type: String,
    },
    title: {
      type: String,
    },
    date: {
      type: Date,
    },
    doctor: {
      type: { type: Schema.ObjectId, ref: "Doctor" },
    },
    patient: {
      type: { type: Schema.ObjectId, ref: "Patient" },
    },
    content: {
      type: [{ type: Schema.ObjectId, ref: "Message" }],
    },
    diagnosis: {
      type: { type: Schema.ObjectId, ref: "Diagnosis" },
    },
  },
  { timestamps: true }
);

// Database Model
export const conversationDTO = model("Conversation", conversationSchema);
