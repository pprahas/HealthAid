import { ConversationDTO } from "@models/Conversation";

export async function updateDiagnosis(conversationId, diagnosis) {
  try {
    const conversation = await ConversationDTO.findById(conversationId);
    // console.log(conversation);

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    conversation.diagnosis = diagnosis;
    let obj = await conversation.save();
    // console.log("saveed, " + obj);
    return obj;
  } catch (error) {
    throw error;
  }
}
