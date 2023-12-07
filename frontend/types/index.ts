import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

// Generic User
export interface User {
  _id: string,
  firstName: string,
  lastName: string,
  email: string,
  activeAccount: boolean,
}

export const UserDefualt: User = {
  _id: "",
  firstName: "",
  lastName: "",
  email: "",
  activeAccount: true,
}

export const DoctorDefault: Doctor = {
  _id: "",
  firstName: "",
  lastName: "",
  email: "",
  patients: [] as string[],
  activeAccount: true,
}

export const PatientDefault: Patient = {
  _id: "",
  firstName: "",
  lastName: "",
  email: "",
  doctors: [] as string[],
  activeAccount: true,
}

export const ClinicDefault: Clinic = {
  name: "",
  postalCode: "",
  website: "",
  phoneNumber: "",
  specialties: "",
  address: ""
}

// Patient
export interface Patient extends User {
  birthday?: Date;
  gender?: string;
  weight?: Number;
  height?: Number;
  bio?: string;
  insurance?: string;
  deliveryOption?: string;
  doctors: string[];
  appointments?: [Appointment];
  healthInfo?: [HealthInformation];
}

// Patient Heath Information
export interface HealthInformation {
  question: string;
  answer: string;
}


// Doctor
export interface Doctor extends User {
  birthday?: Date;
  clinic?: string;
  appointments?: [Appointment];
  prescriptions?: [Prescription]
  patients: string[];
  bio?: string;
}

// Clinic
export interface Clinic {
  name: string;
  postalCode: string;
  website: string;
  phoneNumber: string;
  specialties: string;
  address: string;
  network?: string;
}


// Appointments
export interface Appointment {
  doctorName: string;
  patientName: string;
  date: Date;
}


// Conversations
export interface Conversation {
  _id: string,
  title: String;
  date: Date;
  doctor?: String;
  patient: String;
  messages: Message[];
  diagnosis: String;
}

export const DefaultConversation: Conversation = {
  _id: "",
  title: "Chat with AI",
  date: new Date(),
  patient: "",
  messages: [],
  diagnosis: "none"
}

// Message
export interface Message {
  id: "",
  date: Date;
  senderType: string;
  content: String;
  seen: boolean
}


// Diagnosis
export interface Diagnosis {
  isReviewed: Boolean;
  dateReviewed: Date;
  content: string;
  prescriptions?: [Prescription]
}

// Prescription
export interface Prescription {
  _id: string,
  patientId: string,
  doctorId: string,
  date: Date,
  reminderCycle: string,
  name: string,
  remainingRefills: number,
  requestedRefills: number,
}