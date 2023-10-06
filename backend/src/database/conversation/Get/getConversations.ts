import { ConversationDTO } from "@models/Conversation";
import { Message, MessageDTO } from "@models/Message";

export async function getConversations(patientId: String, doctorId: String) {
  try {
    const conversations = await ConversationDTO.find({ patient: patientId, doctor: doctorId });
    console.log("Before:", conversations)

    const conversationsWithMessages = await Promise.all(
      conversations.map(async (conversation) => {
        const convoToAdd = Object.assign({}, conversation) as any;
        convoToAdd.messages = [];
        convoToAdd._id = conversation._id

        const messages: Message[] = await Promise.all(
          conversation.messages.map(async (messageId) => {
            const currMessageDTO = await MessageDTO.findById(messageId);
            console.log("Message:", currMessageDTO)
            return {
              senderType: currMessageDTO.senderType,
              content: currMessageDTO.content,
              date: currMessageDTO.createdAt,
            };
          })
        );

        convoToAdd.messages = messages;
        return convoToAdd;
      })
    );

    console.log("After:", conversationsWithMessages);
    return conversationsWithMessages;
  } catch (err) {
    throw err;
  }
}
