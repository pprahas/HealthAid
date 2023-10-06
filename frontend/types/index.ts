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
}

export const UserDefualt: User = {
  _id: "",
  firstName: "",
  lastName: "",
  email: "",
}

export const DoctorDefault: Doctor = {
  _id: "",
  firstName: "",
  lastName: "",
  email: "",
  patients: [] as string[]
}

export const PatientDefault: Patient ={
  _id: "",
  firstName: "",
  lastName: "",
  email: "",
  doctors: [] as string[]
}

// Patient
export interface Patient extends User {
  birthday?: Date;
  gender?: string;
  weight?: Number;
  height?: Number;
  bio?: string;
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
  clinic?: Clinic;
  appointments?: [Appointment];
  patients: string[];
}

// Clinic
export interface Clinic {
  name: string;
  address: string;
  website: string;
  phoneNumber: string;
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
  diagnosis?: Diagnosis;
}

export const DefaultConversation: Conversation = {
  _id: "",
  title: "Chat with AI",
  date: new Date(),
  patient: "",
  messages: [],
}

// Message
export interface Message {
  date: Date;
  senderType: string;
  content: String;
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
  date: Date;
  nam: string;
  expirationDate: Date;
  remainingRefills?: Number;
}