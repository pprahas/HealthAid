"use client";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Textarea } from "@nextui-org/input";
import { Skeleton } from "@nextui-org/skeleton";

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
  const [bio, setBio] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [clinicPostCode, setClinicPostCode] = useState("");
  const [clinicWebsite, setClinicWebsite] = useState("");
  const [clinicPhone, setClinicPhone] = useState("");
  const [clinicAddress, setClinicAddress] = useState("");
  const [clinicSpecialties, setClinicSpecialites] = useState("");
  const [clinicNetworks, setClinicNetworks] = useState("");

  const [personalInfoLoaded, setIsLoaded] = useState(false);
  const [clinicInfoLoaded, setClinicInfoLoaded] = useState(false);
  const [activeAccount, setActiveAccount] = useState(Boolean);

  const handleSave = async () => {
    let record: Record<string, string> = {};
    record["firstName"] = firstName;
    record["lastName"] = lastName;
    record["bio"] = bio;

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

  const handleDeactivate = () => {
    const confirmed = window.confirm(
      "Are you sure you want to deactivate your account?"
    );
    if (confirmed) {
      try {
        axios.post("http://localhost:8080/updatePatient", {
          patientId: doctor._id,
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
          patientId: doctor._id,
          add: { activeAccount: true },
        });
        setActiveAccount(true);
      } catch (error) {
        console.error("Error activating account:", error);
      }
    }
  };

  const getClinicInformation = async () => {
    if (typeof doctor.clinic === undefined) return;
    try {
      const response = await axios.post("http://localhost:8080/getClinic", {
        clinicId: doctor.clinic,
      });

      const clinic = await response.data.clinic;
      //setClinic(data.clinic);

      setClinicName(clinic.name);
      setClinicPostCode(clinic.postalCode);
      setClinicWebsite(clinic.website);
      setClinicAddress(clinic.address);
      setClinicSpecialites(clinic.specialties);
      setClinicPhone(clinic.phoneNumber);
      setClinicNetworks(clinic.network);
      setClinicInfoLoaded(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const updateClinicInfo = async () => {
    const newClinic: Clinic = {
      name: clinicName,
      phoneNumber: clinicPhone,
      address: clinicAddress,
      website: clinicWebsite,
      postalCode: clinicPostCode,
      specialties: clinicSpecialties,
      network: clinicNetworks,
    };

    try {
      const response = await axios.post("http://localhost:8080/updateDoctor", {
        doctorId: doctor._id,
        add: {
          clinic: newClinic,
        },
      });
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
    setBio(doctor.bio as unknown as string | "");
    setIsLoaded(true);
    setActiveAccount(doctor.activeAccount)
  }, [doctor]);

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

            <div> Bio </div>
            <div className="col-span-2">
              <Skeleton
                isLoaded={personalInfoLoaded}
                classNames={{ base: "dark:bg-transparent" }}
                className="rounded-xl"
              >
                <Textarea value={bio} onValueChange={setBio} />
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
            {/* <Button
              color={activeAccount ? "danger" : "success"}
              // className="h-16"
              size="lg"
              onClick={activeAccount ? handleDeactivate : handleActivate}
            >
              <div>
                {activeAccount ? "Deactivate" : "Activate"}
              </div>
            </Button> */}
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
              <Skeleton
                isLoaded={clinicInfoLoaded}
                classNames={{ base: "dark:bg-transparent" }}
                className="rounded-xl"
              >
                <Input value={clinicName} onValueChange={setClinicName} />
              </Skeleton>
            </div>

            <div> Phone Number </div>
            <div className="col-span-2">
              <Skeleton
                isLoaded={clinicInfoLoaded}
                classNames={{ base: "dark:bg-transparent" }}
                className="rounded-xl"
              >
                <Input value={clinicPhone} onValueChange={setClinicPhone} />
              </Skeleton>
            </div>

            <div> Website </div>
            <div className="col-span-2">
              <Skeleton
                isLoaded={clinicInfoLoaded}
                classNames={{ base: "dark:bg-transparent" }}
                className="rounded-xl"
              >
                <Input value={clinicWebsite} onValueChange={setClinicWebsite} />
              </Skeleton>
            </div>

            <div> Address </div>
            <div className="col-span-2">
              <Skeleton
                isLoaded={clinicInfoLoaded}
                classNames={{ base: "dark:bg-transparent" }}
                className="rounded-xl"
              >
                <Input value={clinicAddress} onValueChange={setClinicAddress} />
              </Skeleton>
            </div>

            <div> Zip Code </div>
            <div className="col-span-2">
              <Skeleton
                isLoaded={clinicInfoLoaded}
                classNames={{ base: "dark:bg-transparent" }}
                className="rounded-xl"
              >
                <Input
                  value={clinicPostCode}
                  onValueChange={setClinicPostCode}
                />
              </Skeleton>
            </div>

            <div> Specialties </div>
            <div className="col-span-2">
              <Skeleton
                isLoaded={clinicInfoLoaded}
                classNames={{ base: "dark:bg-transparent" }}
                className="rounded-xl"
              >
                <Input
                  value={clinicSpecialties}
                  onValueChange={setClinicSpecialites}
                />
              </Skeleton>
            </div>
            <div> Insurance Network(s) </div>
            <div className="col-span-2">
              <Skeleton
                isLoaded={clinicInfoLoaded}
                classNames={{ base: "dark:bg-transparent" }}
                className="rounded-xl"
              >
                <Input
                  value={clinicNetworks}
                  onValueChange={setClinicNetworks}
                />
              </Skeleton>
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
