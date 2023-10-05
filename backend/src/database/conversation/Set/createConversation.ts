export enum ConversationError {}
export async function createConversation(body){
    try{
        const patientEmail = body.patientEmail
        const doctorEmail = body.doctorEmail
        console.log(patientEmail, doctorEmail)
    } catch(err) {
        console.log("error:", err)
    }
}
