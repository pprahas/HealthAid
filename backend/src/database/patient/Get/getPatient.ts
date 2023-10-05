import { Patient, PatientDTO } from "@models/Patient";
/**
   * Fetches a patient to the dataase
   *
   * @param email - Email of the patient to be fetched
   *
   */
export async function getPatient(email : string): Promise<Patient> {
    try {
        // Verfication checks
        const patient = await PatientDTO.findOne({email : email})
        if (!patient) {
            throw new Error("No patient with the specified email was found.");
        }

        return patient.toObject();
    } catch (error) {
        throw error
    }
}