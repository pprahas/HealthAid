import { DoctorDTO } from "@models/Doctor";

export async function getDoctors() {
  try {
    const doctors = await DoctorDTO.find();
    return doctors;
  } catch (error) {
    throw error;
  }
}
