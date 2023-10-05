export enum ConversationError { }

import { HealthInformationDTO } from "@models/HealthInformation";

import { PatientDTO } from "@models/Patient";
import { DEFAULT_PROMPT } from "./sendMessage";


export async function createConversation(body) {
  try {
    const patientId = body.patientId;

    const patientAccount = await PatientDTO.findById(patientId);

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

    promptToGPT += DEFAULT_PROMPT
    return promptToGPT;
  } catch (err) {
    console.log("error:", err);
    throw err;
  }
}
