import {SVGProps} from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

// Generic User
export interface User {
  firstName: string,
  lastName: string,
  email: string,
  doctors: string[]
}

export interface Doctor {
  firstName: string,
  lastName: string,
  email: string
}

export const UserDefualt: User = {
  firstName: "",
  lastName: "",
  email: "",
  doctors: [],
}

export const DoctorDefault: Doctor = {
  firstName: "",
  lastName: "",
  email: ""
}


// Patient
export interface Patient extends User {
  birthday?: Date;
  gender?: string;
  weight?: Number;
  height?: Number;
  bio?: string;
  doctors?: [Doctor];
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
  patients?: [Patient];
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
  title: String;
  date: Date;
  doctorName: String;
  patientName: String;
  messages: [Message];
  diagnosis: Diagnosis;
}

// Message
export interface Message {
  date: Date;
  senderType: String;
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