import { Patient, PatientDTO } from "@models/Patient";
/**
   * Fetches a doctor from the database
   *
   * @param id - ID of the doctor to be fetched
   *
   */
export async function getPatientById(id : string): Promise<Patient> {
    try {
        // Verfication checks
        const patient = await PatientDTO.findOne({_id : id})
        if (!patient) {
            throw new Error("No patient with the specified id was found.");
        }

        return patient.toObject();
    } catch (error) {
        throw error
    }
}