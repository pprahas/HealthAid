"use client";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Textarea } from "@nextui-org/input";
import axios, { AxiosError } from "axios";
import { DoctorContext } from "../layout";
import { Doctor } from "@/types";
import { useEffect, useState, createContext, useContext } from "react";
import { ClinicDefault, Clinic } from "@/types";

interface FormData {
  [key: string]: string;
}

export default function ProfilePage() {
  const [doctor, setDoctor] = useContext(DoctorContext) as [
    Doctor,
    React.SetStateAction<Doctor>
  ];

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [clinic, setClinic] = useState(ClinicDefault);
  const [clinicName, setClinicName] = useState("")
  const [clinicPostCode, setClinicPostCode] = useState("")
  const [clinicWebsite, setClinicWebsite] = useState("")
  const [clinicPhone, setClinicPhone] = useState("")
  const [clinicAddress, setClinicAddress] = useState("")
  const [clinicSpecialties, setClinicSpecialites] = useState("")


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

    try {
      const response = await axios.post("http://localhost:8080/updateDoctor", {
        doctorId: doctor._id,
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


  const getClinicInformation = async () => {
    if (typeof doctor.clinic === undefined) return;
    try {
      const response = await axios.post(
        "http://localhost:8080/getClinic",
        {
          clinicId: doctor.clinic,
        }
      );

      const clinic = await response.data.clinic;
      //setClinic(data.clinic); 
      
      setClinicName(clinic.name)
      setClinicPostCode(clinic.postalCode)
      setClinicWebsite(clinic.website)
      setClinicAddress(clinic.address)
      setClinicSpecialites(clinic.specialties)
      setClinicPhone(clinic.phoneNumber)
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const updateClinicInfo = async () => {

    const newClinic : Clinic = {
      name: clinicName,
      phoneNumber: clinicPhone,
      address: clinicAddress,
      website: clinicWebsite,
      postalCode: clinicPostCode,
      specialties: clinicSpecialties
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/updateDoctor",
        {
          doctorId: doctor._id,
          add: {
            clinic: newClinic
          }
        }
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleReset = () => {
    window.location.href = "/reset_password";
  };

  useEffect(() => {
    getClinicInformation();
    setFirstName(doctor.firstName);
    setLastName(doctor.lastName);
  }, [doctor]);

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
        <div className="font-bold h-16 text-4xl pr-10">Clinic Information</div>
        <div className="flex-grow overflow-y-auto space-x-1 pr-10">
          <div className="grid grid-cols-3 gap-4 items-center text-xl font-bold pt-3 px-2">
            <div> Name </div>
            <div className="col-span-2">
              <Input value={clinicName} onValueChange={setClinicName} />
            </div>

            <div> Phone Number </div>
            <div className="col-span-2">
              <Input value={clinicPhone} onValueChange={setClinicPhone} />
            </div>

            <div> Website </div>
            <div className="col-span-2">
              <Input value={clinicWebsite} onValueChange={setClinicWebsite} />
            </div>

            <div> Address </div>
            <div className="col-span-2">
              <Input value={clinicAddress} onValueChange={setClinicAddress} />
            </div>

            <div> Zip Code </div>
            <div className="col-span-2">
              <Input value={clinicPostCode} onValueChange={setClinicPostCode} />
            </div>

            <div> Specialties </div>
            <div className="col-span-2">
              <Input value={clinicSpecialties} onValueChange={setClinicSpecialites} />
            </div>
          </div>
        </div>
        <div className="flex space-x-1 pl-1 py-3 place-items-center  ">
          <Button
            color="success"
            className="h-16"
            size="lg"
            onClick={updateClinicInfo}
          >
            <div className="font-bold">Update</div>
          </Button>
        </div>
      </div>
    </section>
  );
}
