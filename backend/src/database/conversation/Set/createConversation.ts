export enum ConversationError {}

import { HealthInformationDTO } from "@models/HealthInformation";

import { PatientDTO } from "@models/Patient";
import { AskGPT } from "@endpoints/controllers/AI/gpt";
import { Conversation, ConversationDTO } from "@models/Conversation";

export async function createConversation(body) {
  try {
    const patientId = body.patientId;
    const doctorId = body.doctorId ?? "gpt";

    const patientAccount = await PatientDTO.findById(patientId);
    let conversation: Conversation = {
      patient: patientId,
      doctor: doctorId,
      diagnosis: "none",
    };

    // 1. Create and save the new conversation
    const newConversation = new ConversationDTO(conversation);
    await newConversation.save();

    const healthInformation = patientAccount.healthInfo;

    let promptToGPT = `Hello ChatGPT. I am a medical professional using this AI to assist with patient assessments. I have the following health information about the patient:`;

    for (const healthInfoId of healthInformation) {
      const healthInfoObject = await HealthInformationDTO.findById(
        healthInfoId
      );
      if (healthInfoObject) {
        promptToGPT += `
        Question: ${healthInfoObject.question} Answer: ${healthInfoObject.answer} `;
      }
    }

    console.log(`Conversatio ID: ${newConversation._id}`);
    let gptResponse = await AskGPT(promptToGPT, [], `${newConversation._id}`);
    return {
      conversationId: newConversation._id,
      gptResponse: gptResponse,
    };
  } catch (err) {
    console.log("error:", err);
    throw err;
  }
}
