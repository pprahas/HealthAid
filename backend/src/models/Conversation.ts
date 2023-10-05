import { Schema, model } from "mongoose";

// Local Model
export type Conversation = {
  doctorName: String;
  patientName: String;
  messages: [any];
  diagnosis: any;
};

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
export const conversationDTO = model("Conversation", conversationSchema);
