import { ConversationDTO } from "@models/Conversation";
import { DoctorDTO } from "@models/Doctor";

export async function updateDiagnosis(conversationId: string, diagnosis: string, doctorEmail: string) {
  try {
    const doctor = await DoctorDTO.findOne({ email: doctorEmail })
    const conversation = await ConversationDTO.findById(conversationId);
    // console.log(conversation);

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    conversation.diagnosis = diagnosis;
    if (doctorEmail != "") { conversation.doctor = `${doctor._id}` }
    await conversation.save();
    return `${doctor._id}`;
  } catch (error) {
    throw error;
  }
}
