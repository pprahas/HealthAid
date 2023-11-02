import { DoctorRequest, DoctorRequestDTO } from "@models/DoctorRequest";

export enum CreateRequestError {
    alreadyRequested = "Already Requested Review"
}

export async function createRequest(doctorRequest: DoctorRequest) {
    try {
        // Verfication checks
        await verifyEmailFree(doctorRequest.doctorEmail);

        // let doctorRequestDTO = new DoctorRequestDTO(doctorEmail, diploma, npi);
        let doctorRequestDTO = new DoctorRequestDTO(doctorRequest);

        await doctorRequestDTO.save();
        return doctorRequestDTO
    } catch (error) {
        throw error
    }
}

async function verifyEmailFree(email: String) {
    const user = await DoctorRequestDTO.findOne({ doctorEmail: email })
    if (!!user) {
        throw CreateRequestError.alreadyRequested;
    }
}