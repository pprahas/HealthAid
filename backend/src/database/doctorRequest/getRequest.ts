import { DoctorRequestDTO } from "@models/DoctorRequest";


export async function getRequest() {
    try {
        const requests = await DoctorRequestDTO.find();
        return requests;
    } catch (error) {
        throw error
    }
}
