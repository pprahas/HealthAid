"use client";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Textarea } from "@nextui-org/input";
import axios, { AxiosError } from "axios";
import { PatientContext } from "../layout";
import { Patient } from "@/types";
import { useEffect, useState, createContext, useContext } from "react";

interface FormData {
  [key: string]: string;
}

export default function ProfilePage() {
  const [patient, setPatient] = useContext(PatientContext) as [
    Patient,
    React.SetStateAction<Patient>
  ];
  // State for personal information
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    birthday: "",
    address: "",
    gender: "",
    newPassword: "", // New password field
    confirmPassword: "", // Confirm password field
  });

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");

  const [questions, setQuestions] = useState([
    { _id: "1", question: "Question 1", answer: "" },
    { _id: "2", question: "Question 2", answer: "" },
    { _id: "3", question: "Question 3", answer: "" },
    { _id: "4", question: "Question 4", answer: "" },
    { _id: "5", question: "Question 5", answer: "" },
  ]);

  const handleSave = async () => {
    let record: Record<string, string> = {};
    record["firstName"] = firstName;
    record["lastName"] = lastName;
    record["birthday"] = birthday;
    record["gender"] = gender;

    try {
      const response = await axios.post("http://localhost:8080/updatePatient", {
        patientId: patient._id,
        add: record,
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const handleQuestionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    const updatedQuestions = questions.map((q) =>
      q._id === id ? { ...q, answer: e.target.value } : q
    );
    setQuestions(updatedQuestions);
  };

  const updateHealthInfo = async () => {
    let record: Record<string, string> = {};

    questions.forEach((question) => {
      record[question.question] = question.answer;
    });

    try {
      const response = await axios.post(
        "http://localhost:8080/patientHealthInformation",
        {
          email: patient.email,
          information: record,
        }
      );
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getPatientHealthInfo = async () => {
    if (typeof patient.healthInfo === undefined) return;
    try {
      const response = await axios.post(
        "http://localhost:8080/patientHealthInformation/getHealthInformation",
        {
          healthInfoIds: patient.healthInfo,
        }
      );

      const data = await response.data;
      setQuestions(data.healthInformationObjects);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleReset = () => {
    window.location.href = "/reset_password";
  };

  useEffect(() => {
    getPatientHealthInfo();
    setFirstName(patient.firstName);
    setLastName(patient.lastName);
    setGender(patient.gender || "");
    setBirthday((patient.birthday as unknown as string) || "");
  }, [patient]);

  return (
    <section className="columns-2 items-start h-[calc(100vh-60px)]">
      <div className="w-full h-full pt-9 pl-10 pr-8 overflow-hidden">
        <h1 className="font-bold text-4xl">Personal Information</h1>
        <div className="overflow-auto h-full my-3 mt-10">
          <div className="grid grid-cols-3 gap-4 items-center text-xl font-bold pt-3 px-2">
            <div> First Name </div>
            <div className="col-span-2">
              <Input value={firstName} onValueChange={setFirstName} />
            </div>

            <div> Last Name </div>
            <div className="col-span-2">
              <Input value={lastName} onValueChange={setLastName} />
            </div>

            <div> Birthday </div>
            <div className="col-span-2">
              <Input value={birthday} onValueChange={setBirthday} />
            </div>

            <div> Address </div>
            <div className="col-span-2">
              <Input value={address} onValueChange={setAddress} />
            </div>

            <div> Gender </div>
            <div className="col-span-2">
              <Input value={gender} onValueChange={setGender} />
            </div>
          </div>

          <div className="flex pt-10 space-x-8">
            <Button size="lg" color="success" onClick={handleSave}>
              Save changes
            </Button>
            <Button size="lg" onClick={handleReset}>
              Change password
            </Button>
            <Button size="lg" color="danger" onClick={handleLogout}>
              Log out
            </Button>
          </div>
        </div>
      </div>
      <div className="h-[calc(100vh-56px)] bg-slate-200 rounded-tl-3xl pt-8 pl-10 flex flex-col overflow-hidden">
        <div className="font-bold h-16 text-4xl pr-10">Health Information</div>
        <div className="flex-grow overflow-y-auto space-x-1 pr-10">
          {questions.map((q, index: number) => (
            <div className="mb-4" key={index}>
              <div>
                <label>{q.question}</label>
              </div>
              <Textarea
                placeholder=""
                value={q.answer}
                onChange={(e) => handleQuestionChange(e, q._id)}
              />
            </div>
          ))}
        </div>
        <div className="flex space-x-1 pl-1 py-3 place-items-center  ">
          <Button
            color="success"
            className="h-16"
            size="lg"
            onClick={updateHealthInfo}
          >
            <div className="font-bold">Update</div>
          </Button>
        </div>
      </div>
    </section>
  );
}
