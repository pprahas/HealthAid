import { ConversationDTO } from "@models/Conversation";

export async function getConversations(patientId) {
  try {
    const conversations = await ConversationDTO.find({ patient: patientId });

    return conversations;
  } catch (err) {
    throw err;
  }
}
