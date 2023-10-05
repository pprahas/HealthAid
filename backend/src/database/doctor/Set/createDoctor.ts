import { Doctor, DoctorDTO } from "@models/Doctor";
import { pbkdf2Sync } from "crypto";

// Errors that can be thrown during signup
export enum CreateDoctorError {
    invalidDoctorInfo = "Invalid Doctor Info",
    invalidPassword = "Invalid Password",
    invalidEmail = "Invalid Email Address",
    emailInUse = "Email already in use"
}

/**
   * Adds a doctor to the dataase
   *
   * @param doctor - Info of the doctor you are creating
   *
   */
export async function createDoctor(doctor: Doctor) {
    try {
        // Verfication checks
        verifyInfo(doctor)
        await verifyEmailFree(doctor.email);

        // Hash password
        let userPassword = doctor.password
        let hashedPassword = pbkdf2Sync(userPassword, '', 10000, 64, 'sha512').toString('hex');
        doctor.password = hashedPassword
        
        // Create mongoDB patient
        let doctorDTO = new DoctorDTO(doctor)

        // Save patient
        await doctorDTO.save();
        return doctorDTO
    } catch (error) {
        throw error
    }
}


// Helper Functions

/**
   * Checks if the email is currently being used by another user
   *
   * @param email - The email you are checking
   *
   * @returns Void, will throw an error if email is taken
   */
async function verifyEmailFree(email: String) {
    const user = await DoctorDTO.findOne({ email: email })
    if (!!user) {
        throw CreateDoctorError.emailInUse
    }
}

/**
   * Verifies that all doctor info is valid
   * Checks that the email is a valid email and first/last name are not empty
   *
   * @param doctor - Info of the doctor
   *
   * @returns Void, will throw an error if email is taken
   */
function verifyInfo(doctor: Doctor) {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    // Verify email is a valid email
    if (doctor.email == "" || !emailRegex.test(doctor.email)) {
        throw CreateDoctorError.invalidEmail
    }

    // Verify first and last name are not empty
    if (doctor.firstName == "" || doctor.lastName == "") {
        throw CreateDoctorError.invalidDoctorInfo
    }
}