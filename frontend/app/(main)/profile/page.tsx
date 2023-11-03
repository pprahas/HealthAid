"use client";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Textarea } from "@nextui-org/input";
import { Skeleton } from "@nextui-org/skeleton";
import axios, { AxiosError } from "axios";
import { PatientContext } from "../layout";
import { Patient } from "@/types";
import { useEffect, useState, createContext, useContext } from "react";

interface FormData {
  [key: string]: string;
}

// function fetchUserData() {
//   let userObjectString = localStorage.getItem("user") ?? "";
//   let userObject = JSON.parse(userObjectString);
//   return userObject;
// }

// const user = fetchUserData();

// Check if the user is a doctor and redirect to /doctor/profile
// if (user.userType === "doctor") {
  // window.location.href = "/doctor/profile";
// }

export default function ProfilePage() {
  const [patient, setPatient] = useContext(PatientContext) as [
    Patient,
    React.SetStateAction<Patient>
  ];

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bio, setBio] = useState("");
  const [insurance, setInsurance] = useState("");

  const [personalInfoLoaded, setIsLoaded] = useState(false);
  const [healthInfoLoaded, setHealthInfoLoaded] = useState(false);
  const [activeAccount, setActiveAccount] = useState(Boolean);


  const changeHeight = (value: string) => {
    let res = parseInt(value).toString();
    if (res !== "NaN") {
      setHeight(res);
    }
    if (value === "") {
      setHeight("");
    }
  };

  const changeWeight = (value: string) => {
    let res = parseInt(value).toString();
    if (res !== "NaN") {
      setWeight(res);
    }
    if (value === "") {
      setWeight("");
    }
  };

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
    record["height"] = height;
    record["weight"] = weight;
    record["bio"] = bio;
    record["insurance"] = insurance;

    try {
      const response = await axios.post("http://localhost:8080/updatePatient", {
        patientId: patient._id,
        add: record,
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeactivate = () => {
    const confirmed = window.confirm(
      "Are you sure you want to deactivate your account?"
    );
    if (confirmed) {
      try {
        axios.post("http://localhost:8080/updatePatient", {
          patientId: patient._id,
          add: { activeAccount: false },
        });
        setActiveAccount(false);
      } catch (error) {
        console.error("Error deactivating account:", error);
      }
    }
  };

  const handleActivate = () => {
    const confirmed = window.confirm(
      "Are you sure you want to activate your account?"
    );
    if (confirmed) {
      try {
        axios.post("http://localhost:8080/updatePatient", {
          patientId: patient._id,
          add: { activeAccount: true },
        });
        setActiveAccount(true);
      } catch (error) {
        console.error("Error activating account:", error);
      }
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
      setHealthInfoLoaded(true);
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
    setHeight((patient.height as unknown as string) || "");
    setWeight((patient.weight as unknown as string) || "");
    setBio((patient.bio as unknown as string) || "");
    setInsurance((patient.insurance as unknown as string) || "");
    setIsLoaded(true);
    setActiveAccount(patient.activeAccount)
  }, [patient]);

  return (
    <section className="columns-2 items-start h-[calc(100vh-60px)]">
      <div className="w-full h-full pt-9 pl-10 pr-8 overflow-hidden">
        <h1 className="font-bold text-4xl">Personal Information</h1>
        <div className="overflow-auto h-full my-3 mt-10">
          <div className="grid grid-cols-3 gap-4 items-center text-xl font-bold pt-3 px-2">
            <div> First Name </div>
            <div className="col-span-2">
              <Skeleton
                isLoaded={personalInfoLoaded}
                classNames={{ base: "dark:bg-transparent" }}
                className="rounded-xl"
              >
                <Input value={firstName} onValueChange={setFirstName} />
              </Skeleton>
            </div>

            <div> Last Name </div>
            <div className="col-span-2">
              <Skeleton
                isLoaded={personalInfoLoaded}
                classNames={{ base: "dark:bg-transparent" }}
                className="rounded-xl"
              >
                <Input value={lastName} onValueChange={setLastName} />
              </Skeleton>
            </div>

            <div> Birthday </div>
            <div className="col-span-2">
              <Skeleton
                isLoaded={personalInfoLoaded}
                classNames={{ base: "dark:bg-transparent" }}
                className="rounded-xl"
              >
                <Input value={birthday} onValueChange={setBirthday} />
              </Skeleton>
            </div>

            <div> Gender </div>
            <div className="col-span-2">
              <Skeleton
                isLoaded={personalInfoLoaded}
                classNames={{ base: "dark:bg-transparent" }}
                className="rounded-xl"
              >
                <Input value={gender} onValueChange={setGender} />
              </Skeleton>
            </div>

            <div> Height </div>
            <div className="col-span-2">
              <Skeleton
                isLoaded={personalInfoLoaded}
                classNames={{ base: "dark:bg-transparent" }}
                className="rounded-xl"
              >
                <Input value={height} onValueChange={changeHeight} />
              </Skeleton>
            </div>

            <div> Weight </div>
            <div className="col-span-2">
              <Skeleton
                isLoaded={personalInfoLoaded}
                classNames={{ base: "dark:bg-transparent" }}
                className="rounded-xl"
              >
                <Input value={weight} onValueChange={changeWeight} />
              </Skeleton>
            </div>

            <div> Bio </div>
            <div className="col-span-2">
              <Skeleton
                isLoaded={personalInfoLoaded}
                classNames={{ base: "dark:bg-transparent" }}
                className="rounded-xl"
              >
                <Textarea value={bio} maxRows={3} onValueChange={setBio} />
              </Skeleton>
            </div>
            <div> Insurance Network </div>
            <div className="col-span-2">
              <Skeleton
                isLoaded={personalInfoLoaded}
                classNames={{ base: "dark:bg-transparent" }}
                className="rounded-xl"
              >
                <Textarea
                  value={insurance}
                  maxRows={3}
                  onValueChange={setInsurance}
                />
              </Skeleton>
            </div>
          </div>

          <div className="flex pt-10 space-x-8">
            <Button size="lg" color="success" onClick={handleSave}>
              Save changes
            </Button>
            <Button size="lg" onClick={handleReset}>
              Change password
            </Button>
            
            <Button
              color={activeAccount ? "danger" : "success"}
              // className="h-16"
              size="lg"
              onClick={activeAccount ? handleDeactivate : handleActivate}
            >
              <div>
                {activeAccount ? "Deactivate" : "Activate"}
              </div>
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
                <Skeleton
                  isLoaded={healthInfoLoaded}
                  classNames={{ base: "dark:bg-transparent" }}
                  className="rounded-xl"
                >
                  <label>{q.question}</label>
                </Skeleton>
              </div>
              <Skeleton
                isLoaded={healthInfoLoaded}
                classNames={{
                  base: "dark:bg-transparent",
                }}
                className="rounded-xl mb-4"
              >
                <Textarea
                  placeholder=""
                  value={q.answer}
                  onChange={(e) => handleQuestionChange(e, q._id)}
                />
              </Skeleton>
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
