import { DoctorRequestDTO } from "@models/DoctorRequest";
import { DoctorDTO } from "@models/Doctor";

export async function reviewRequest(doctorEmail: string, approval: boolean) {
    try {
      const doctorAccount = await DoctorDTO.findOne({ email: doctorEmail })
  
      if (doctorEmail != "") { 
        doctorAccount.activeAccount = approval;
        // delete request from DB
        await DoctorRequestDTO.deleteOne({ email: doctorEmail });
        await doctorAccount.save();
      }
    } catch (error) {
      throw error;
    }
  }