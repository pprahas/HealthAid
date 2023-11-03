export enum ConversationError { }

// import { HealthInformationDTO } from "@models/HealthInformation";

// import { PatientDTO } from "@models/Patient";
// import { AskGPT } from "@endpoints/controllers/AI/gpt";
import { Conversation, ConversationDTO } from "@models/Conversation";
import { Message, MessageDTO } from "@models/Message";
import { PatientDTO } from "@models/Patient";

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

    const newConversation = new ConversationDTO(conversation);
    await newConversation.save();

    console.log(`Conversation ID: ${newConversation._id}`);

    let gptFirstMessage: Message = {
      senderType: "gpt",
      content: `Hey, welcome to Health Aid! How can I help you ${patientAccount.firstName} ${patientAccount.lastName}?`,
    };

    const newMessage = new MessageDTO(gptFirstMessage);
    await newMessage.save();

    await ConversationDTO.findByIdAndUpdate(
      newConversation._id,
      { $push: { messages: newMessage._id } },
      { new: true, useFindAndModify: false }
    );

    return {
      conversationId: newConversation._id,
      gptResponse: gptFirstMessage,
    };
  } catch (err) {
    console.log("error:", err);
    throw err;
  }
}
