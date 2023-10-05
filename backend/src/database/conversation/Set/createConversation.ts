export enum ConversationError {}

import { HealthInformationDTO } from "@models/HealthInformation";

import { PatientDTO } from "@models/Patient";

export async function createConversation(body) {
  try {
    const patientId = body.patientId;

    const patientAccount = await PatientDTO.findById(patientId);

    const healthInformation = patientAccount.healthInfo;
    const healthInformationObjects = [];

    for (const healthInfoId of healthInformation) {
      const healthInfoObject = await HealthInformationDTO.findById(
        healthInfoId
      );
      if (healthInfoObject) {
        healthInformationObjects.push(healthInfoObject);
      }
    }

    return healthInformationObjects;

    if (patientAccount) {
      return healthInformation;
    } else {
      return "none";
    }

    // console.log("patient account is", patientAccount);
  } catch (err) {
    console.log("error:", err);
    throw err;
  }
}
