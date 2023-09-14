import { Patient, PatientDTO } from "@models/patient/Patient";

export enum CreatePatientError {
    invalidPatientInfo = "Invalid User Info",
    invalidPassword = "Invalid Password",
    invalidEmail = "Invalid Email Address",
    emailInUse = "Email already in use"
}


export async function createPatient(patient: Patient) {
    try {
        // Verfication checks
        verifyInfo(patient)
        await verifyEmailFree(patient.email);

        // Create mongoDB patient
        let patientDTO = new PatientDTO(patient)

        // Save patient
        let document = await patientDTO.save();
        console.log(document)
    } catch (error) {
        throw error
    }

    // Helper Functions
    async function verifyEmailFree(email: String) {
        const user = await PatientDTO.findOne({ email: email })
        if (!!user) {
            throw CreatePatientError.emailInUse
        }
    }
    
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
}