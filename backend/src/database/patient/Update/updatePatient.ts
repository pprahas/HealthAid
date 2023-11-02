import { DoctorDTO } from "@models/Doctor";
import { PatientDTO } from "@models/Patient";

export enum UpdatePatientError {
  invalidEmailPatient = "Invalid Patient Email",
  invalidEmailDoctor = "Invalid Doctor Email",
  invalidField = "Invalid Field",
}

export async function updatePatient(patientId, fieldsToAdd, fieldsToRemove) {
  let responseMessages = [];
  try {
    const patientAccount = await PatientDTO.findById(patientId);

    if (!patientAccount) {
      throw UpdatePatientError.invalidEmailPatient;
    }

    if (fieldsToAdd) {
      for (const key in fieldsToAdd) {
        const value = fieldsToAdd[key];
        console.log(key, value);
        if (key === "doctors") {
          responseMessages.push("Doctor added to patient");
          console.log("doctors detected");
          // console.log("doctors are", patientAccount.doctors);
          if (
            patientAccount.doctors.length == 0 ||
            patientAccount.doctors.findIndex(value) == -1
          ) {
            // console.log("doctor does not exist");
            patientAccount.doctors.push(value);
          }
          const doctorAccount = await DoctorDTO.findById(value);
          if (
            doctorAccount.patients.length == 0 ||
            doctorAccount.patients.findIndex(patientId) == -1
          ) {
            doctorAccount.patients.push(patientId);
            await doctorAccount.save();
          }
        } else {
          // console.log("other stuff detected");
          responseMessages.push("Updated " + key + " field for patient");
          patientAccount[key] = value;
        }
      }
    }

    if (fieldsToRemove) {
      for (const key in fieldsToRemove) {
        const value = fieldsToRemove[key];
        console.log(key, value);

        if (key === "doctors") {
          responseMessages.push("Doctor removed from patient");
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
          responseMessages.push("Deleted fields for patient");
          delete patientAccount[key];
        }
      }
    }

    await patientAccount.save();
    if (responseMessages.length === 0) {
      return "No change has been made";
    }
    return responseMessages;
  } catch (error) {
    throw error;
  }
}
