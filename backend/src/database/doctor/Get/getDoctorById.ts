import { Doctor, DoctorDTO } from "@models/Doctor";
/**
   * Fetches a doctor from the database
   *
   * @param id - ID of the doctor to be fetched
   *
   */
export async function getDoctorById(id : string): Promise<Doctor> {
    try {
        // Verfication checks
        const doctor = await DoctorDTO.findOne({_id : id})
        if (!doctor) {
            throw new Error("No doctor with the specified id was found.");
        }

        return doctor.toObject();
    } catch (error) {
        throw error
    }
}