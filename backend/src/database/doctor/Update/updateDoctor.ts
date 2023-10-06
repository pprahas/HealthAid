import { ClinicDTO } from "@models/Clinic";
import { DoctorDTO } from "@models/Doctor";
import { PatientDTO } from "@models/Patient";

export enum UpdateDoctorError {
  invalidEmail = "Invalid Email",
  invalidField = "Invalid Field",
}

export async function updateDoctor(doctorId, fieldsToAdd, fieldsToRemove) {
  try {
    const doctorAccount = await DoctorDTO.findById(doctorId);

    if (!doctorAccount) {
      throw UpdateDoctorError.invalidEmail;
    }

    if (fieldsToAdd) {
      for (const key in fieldsToAdd) {
        const value = fieldsToAdd[key];
        if (key === "patient") {
          doctorAccount.patients.push(value);
          console.log("adding patients 1 " + key + " " + value);
          //   doctorAccount.patients.push(value);
          const patientAccount = await PatientDTO.findById(value);
          //   await doctorAccount.save();
          patientAccount.doctors.push(doctorId);
          await patientAccount.save();
          console.log("adding patients" + key + value);
        }
        if (key === "clinic") {
          //   let clinicInfo = JSON.stringify(value);
          const newClinic = new ClinicDTO(value);
          await newClinic.save();

          doctorAccount.clinic = newClinic._id;

          console.log("new clinic" + newClinic);
        }
      }
    }

    if (fieldsToRemove) {
      for (const key in fieldsToAdd) {
        const value = fieldsToAdd[key];
        if (key === "patient") {
          const patientIndex = doctorAccount.patients.indexOf(value);
          if (patientIndex !== -1) {
            doctorAccount.patients.splice(patientIndex, 1);
          }

          const patientAccount = await PatientDTO.findById(value);
          const doctorIndex = patientAccount.doctors.indexOf(doctorId);
          if (doctorIndex !== -1) {
            patientAccount.doctors.splice(doctorIndex, 1);
          }
          await patientAccount.save();
        }
      }
    }
    console.log("DOCTOR BEING SAVED");
    await doctorAccount.save();
  } catch (error) {
    throw error;
  }
}
