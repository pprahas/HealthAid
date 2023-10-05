import { Patient, PatientDTO } from "@models/Patient";
import { pbkdf2Sync } from "crypto";

// Errors that can be thrown during signup
export enum CreatePatientError {
    invalidPatientInfo = "Invalid Patient Info",
    invalidPassword = "Invalid Password",
    invalidEmail = "Invalid Email Address",
    emailInUse = "Email already in use"
}

/**
   * Adds a patient to the dataase
   *
   * @param patient - Info of the patient you are creating
   *
   */
export async function createPatient(patient: Patient) {
    try {
        // Verfication checks
        verifyInfo(patient)
        await verifyEmailFree(patient.email);

        // Hash password
        let userPassword = patient.password
        let hashedPassword = pbkdf2Sync(userPassword, '', 10000, 64, 'sha512').toString('hex');
        patient.password = hashedPassword
        patient.userType = "patient"

        // Create mongoDB patient
        let patientDTO = new PatientDTO(patient)

        // Save patient
        await patientDTO.save();
        return patientDTO
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
    const user = await PatientDTO.findOne({ email: email })
    if (!!user) {
        throw CreatePatientError.emailInUse
    }
}

/**
   * Verifies that all patient info is valid
   * Checks that the email is a valid email and first/last name are not empty
   *
   * @param patient - Info of the patient
   *
   * @returns Void, will throw an error if email is taken
   */
function verifyInfo(patient: Patient) {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    // Verify email is a valid email
    if (patient.email == "" || !emailRegex.test(patient.email)) {
        throw CreatePatientError.invalidEmail
    }

    // Verify first and last name are not empty
    if (patient.firstName == "" || patient.lastName == "") {
        throw CreatePatientError.invalidPatientInfo
    }
}