import { Application } from "express";
import registerRoutes from "./authentication/register";
import loginRoutes from "./authentication/login";
import resetPasswordRoutes from "./authentication/resetPassword";
import getPatient from "./patient/getPatient";
import getPatientById from "./patient/getPatientById";
import getDoctorById from "./doctor/getDoctorById";

import patientHealthInformationRoutes from "./extraInformation/patientHealthInformation";
import doctorClinicInformationRoutes from "./extraInformation/doctorClinicInformation";
import conversationRoutes from "./conversation/conversation";
import updatePatientRoutes from "./updatePatient/updatePatient";
import UpdateDoctorRoutes from "./updateDoctor/updateDoctor";
import getClinic from "./extraInformation/getClinic";
import diagnosisRoutes from "./doctor/updateDiagnosis";
import appointmentRoutes from "./appointment/appointment";
import createRequest from "./doctorRequest/createRequest";
import reviewRequest from "./doctorRequest/reviewRequest";
import getRequest from "./doctorRequest/getRequest";
import prescriptionRoutes from "./prescription/prescription";

export default class Routes {
  constructor(app: Application) {
    app.use("/resetPassword", resetPasswordRoutes);
    app.use("/register", registerRoutes);
    app.use("/login", loginRoutes);
    app.use("/getPatientByEmail", getPatient);
    app.use("/getPatientFromId", getPatientById);
    app.use("/getDoctorFromId", getDoctorById);
    app.use("/patientHealthInformation", patientHealthInformationRoutes);
    app.use("/doctorClinicInformation", doctorClinicInformationRoutes);
    app.use("/conversation", conversationRoutes);
    app.use("/updatePatient", updatePatientRoutes);
    app.use("/updateDoctor", UpdateDoctorRoutes);
    app.use("/getClinic", getClinic);
    app.use("/updateDiagnosis", diagnosisRoutes);
    app.use("/appointment", appointmentRoutes);
    app.use("/prescription", prescriptionRoutes);
    app.use("/createRequest", createRequest);
    app.use("/reviewRequest", reviewRequest);
    app.use("/getRequest", getRequest);
  }
}
