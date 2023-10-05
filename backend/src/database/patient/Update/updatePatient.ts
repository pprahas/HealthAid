import { DoctorDTO } from "@models/Doctor";
import { PatientDTO } from "@models/Patient";

export enum UpdatePatientError {
  invalidEmail = "Invalid Email",
  invalidField = "Invalid Field",
}

export async function updatePatient(patientId, fieldsToAdd, fieldsToRemove) {
  try {
    const patientAccount = await PatientDTO.findById(patientId);

    if (!patientAccount) {
      throw UpdatePatientError.invalidEmail;
    }

    if (fieldsToAdd) {
      for (const key in fieldsToAdd) {
        const value = fieldsToAdd[key];
        console.log(key, value);
        if (key === "doctors") {
          // console.log("doctors detected");
          patientAccount.doctors.push(value);
          const doctorAccount = await DoctorDTO.findById(value);
          doctorAccount.patients.push(patientId);
          await doctorAccount.save();
        } else {
          // console.log("other stuff detected");
          patientAccount[key] = value;
        }
      }
    }

    if (fieldsToRemove) {
      for (const key in fieldsToRemove) {
        const value = fieldsToRemove[key];
        console.log(key, value);

        if (key === "doctors") {
          const doctorIndex = patientAccount.doctors.indexOf(value);
          if (doctorIndex !== -1) {
            patientAccount.doctors.splice(doctorIndex, 1);
          }

          const doctorAccount = await DoctorDTO.findById(value);
          const patientIndex = doctorAccount.patients.indexOf(patientId);
          if (patientIndex !== -1) {
            doctorAccount.patients.splice(patientIndex, 1);
          }
          await doctorAccount.save();
        } else {
          delete patientAccount[key];
        }
      }
    }

    await patientAccount.save();
  } catch (error) {
    throw error;
  }
}
