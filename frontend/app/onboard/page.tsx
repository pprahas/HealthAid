"use client";
import { title } from "@/components/primitives";
import React, { useState, JSX, useEffect, use } from "react";
import { Checkbox, CheckboxGroup } from "@nextui-org/react";
import PatientQuestions from "./components/patientQuestions";
import DoctorQuestions from "./components/doctorQuestions";

export default function OnboardPage() {
  const [role, setRole] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  useEffect(() => {
    let userObjectString = localStorage.getItem("user") ?? "";
    let userObject = JSON.parse(userObjectString);
    let role = userObject.userType;
    let firstName = userObject.firstName;
    let lastName = userObject.lastName;
    setRole(role);
    setFirstName(firstName);
    setLastName(lastName);
    console.log("set the requirements ");
  }, []);

  if (role != "") {
    return (
      <div>
        <div className="flex flex-col items-center space-y-[3vh]">
          <div className="text-4xl font-bold w-[100vw]">
            Welcome {firstName} {lastName}
          </div>
          {role == "patient" && <PatientQuestions />}
          {role == "doctor" && <DoctorQuestions />}
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div className="flex flex-col items-center space-y-[3vh]">
          <div className="text-4xl font-bold w-[100vw]">
            Welcome {firstName} {lastName}
          </div>
        </div>
      </div>
    );
  }
}
