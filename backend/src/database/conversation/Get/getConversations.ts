import { Conversation, ConversationDTO } from "@models/Conversation";
import { Message, MessageDTO } from "@models/Message";

export async function getConversations(patientId: String, doctorId: String) {
  try {
    const conversations = await ConversationDTO.find({ patient: patientId, doctor: doctorId });
    console.log("Before:", conversations)

    const conversationsWithMessages = await Promise.all(
      conversations.map(async (conversation) => {
        const convoToAddDoc = Object.assign({}, conversation) as any;
        const convoToAdd: Conversation = convoToAddDoc._doc

        const messages: Message[] = await Promise.all(
          conversation.messages.map(async (messageId) => {
            const currMessageDTO = await MessageDTO.findById(messageId);
            console.log("Message:", currMessageDTO)
            return {
              id: currMessageDTO.id,
              senderType: currMessageDTO.senderType,
              content: currMessageDTO.content,
              date: currMessageDTO.createdAt,
              seen: currMessageDTO.seen,
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
