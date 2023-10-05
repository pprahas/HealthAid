import { conversationDTO } from "@models/Conversation";

export async function getConversations(patientId) {
  try {
    const conversations = await conversationDTO.find({ patient: patientId });

    return conversations;
  } catch (err) {
    throw err;
  }
}
