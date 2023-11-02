import { DoctorRequestDTO } from "@models/DoctorRequest";

export enum CreateRequestError {
    alreadyRequested = "Already Requested Review"
}

export async function createRequest(doctorEmail: String, diploma: Buffer, npi: String) {
    try {
        // Verfication checks
        await verifyEmailFree(doctorEmail);

        let doctorRequestDTO = new DoctorRequestDTO(doctorEmail, diploma, npi);

        await doctorRequestDTO.save();
        return doctorRequestDTO;
    } catch (error) {
        throw error
    }
}

async function verifyEmailFree(email: String) {
    const user = await DoctorRequestDTO.findOne({ email: email })
    if (!!user) {
        throw CreateRequestError.alreadyRequested;
    }
}