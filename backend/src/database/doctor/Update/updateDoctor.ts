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
        // if (key === "patient") {
        //   console.log("adding patients 1 " + key + " " + value);
        //   console.log("THE DOCTOR ACC IS ", doctorAccount);
        //   doctorAccount.patients.push(value);
        //   doctorAccount.patients.push(value);
        //   const patientAccount = await PatientDTO.findById(value);
        //   console.log("THE PATIENT ACC IS ", patientAccount);
        //   //   await doctorAccount.save();
        //   patientAccount.doctors.push(doctorId);
        //   await patientAccount.save();
        //   console.log("adding patients" + key + value);
        // }
        if (key === "clinic") {
          //   let clinicInfo = JSON.stringify(value);

          const clinicInfo = await ClinicDTO.findById(doctorAccount.clinic);

          // console.log("isnide clinic", value);

          clinicInfo.name = value.name;
          clinicInfo.postalCode = value.postalCode;
          clinicInfo.website = value.website;
          clinicInfo.phoneNumber = value.phoneNumber;
          clinicInfo.specialties = value.specialties;
          // console.log("new clinic", clinicInfo);

          // const newClinic = new ClinicDTO(value);
          await clinicInfo.save();

          // doctorAccount.clinic = newClinic._id;

          // console.log("new clinic" + newClinic);
        } else {
          doctorAccount[key] = value;
        }
      }
    }

    if (fieldsToRemove) {
      for (const key in fieldsToRemove) {
        const value = fieldsToRemove[key];
        if (key === "patient") {
          const patientIndex = doctorAccount.patients.indexOf(value);
          // console.log("deleting for doctors index is ", patientIndex);
          if (patientIndex !== -1) {
            // console.log("deleting for doctors");
            doctorAccount.patients.splice(patientIndex, 1);
          }

          const patientAccount = await PatientDTO.findById(value);
          const doctorIndex = patientAccount.doctors.indexOf(doctorId);
          // console.log("deleting for patients index is ", doctorIndex);
          if (doctorIndex !== -1) {
            // console.log("deleting for patients");
            patientAccount.doctors.splice(doctorIndex, 1);
          }
          await patientAccount.save();
        }
      }
    }
    // console.log("DOCTOR BEING SAVED");
    await doctorAccount.save();
  } catch (error) {
    throw error;
  }
}
