export enum ConversationError {}

import { HealthInformationDTO } from "@models/HealthInformation";

import { PatientDTO } from "@models/Patient";

export async function createConversation(body) {
  try {
    const patientId = body.patientId;

    const patientAccount = await PatientDTO.findById(patientId);

    const healthInformation = patientAccount.healthInfo;
    // const healthInformationObjects = [];

    let promptToGPT = `Hello ChatGPT. I am a medical professional using this AI to assist with patient assessments. I have the following health information about the patient:
    `;

    for (const healthInfoId of healthInformation) {
      const healthInfoObject = await HealthInformationDTO.findById(
        healthInfoId
      );
      if (healthInfoObject) {
        promptToGPT += `
        Question: ${healthInfoObject.question} Answer: ${healthInfoObject.answer} `;
        // healthInformationObjects.push(healthInfoObject);
      }
    }

    promptToGPT += `

Now, I want you to act like a doctor, introduce yourself to the patient humanly, and be friendly. Introduce yourself as ChatGPT, not any doctor, and keep the introduction message short and ask the patient about their current health concerns. If you think you have a diagnosis for the patient after talking to them for a while, respond with "you have been diagnosed with: " and then include the diagnosis. don't tell them to seek medical attention, and tell them to forward this entire conversation with the diagnosis to a doctor if they want to. Don't include the health information i have provided above in the introductory message, but do keep them in mind when providing a diagnosis. Ask as many questions as possible, at least 3 minimum questions. `;

    return promptToGPT;
    // console.log("patient account is", patientAccount);
  } catch (err) {
    console.log("error:", err);
    throw err;
  }
}
