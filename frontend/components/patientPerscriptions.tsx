"use client";

import { SetStateAction, useContext, useEffect, useState } from "react";
import { Button } from "@nextui-org/button";
import {
  DoctorContext,
  PatientListContext,
  SidebarContext,
} from "@/app/doctor/layout";
import { Doctor, Patient, Prescription } from "@/types";
import {
  DropdownMenu,
  Dropdown,
  DropdownTrigger,
  DropdownItem,
} from "@nextui-org/react";
import axios from "axios";
import { PatientContext } from "@/app/(main)/layout";

interface prescriptionProps {
  prescriptions: Prescription[];
}

export const PatientPerscriptionView = ({
  prescriptions,
}: prescriptionProps) => {
  const [visblePrescriptions, setVisblePrescriptions] =
    useState<Prescription[]>(prescriptions);

  const [patientList, setPatientList] = useContext(PatientListContext) as [
    Patient[],
    React.Dispatch<React.SetStateAction<Patient[]>>
  ];

  const [sidebarIndex, setSidebarIndex] = useContext(SidebarContext) as [
    number,
    React.Dispatch<React.SetStateAction<number>>
  ];

  const [lastUpdatedId, setLastUpdatedId] = useState("");

  const updateRequest = async (prescriptionId: string, approved: boolean) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/prescription/updateRequests",
        {
          prescriptionId: prescriptionId,
          action: approved ? "Approved" : "Denied",
        }
      );
      setLastUpdatedId(prescriptionId);
      visblePrescriptions?.forEach((prescription) => {
        if (prescription._id == prescriptionId) {
          prescription.remainingRefills = approved
            ? prescription.remainingRefills + prescription.requestedRefills
            : prescription.remainingRefills;
          prescription.requestedRefills = 0;
        }
      });
      setVisblePrescriptions(visblePrescriptions);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (prescriptions && patientList && sidebarIndex) {
      let filteredPrescriptions = prescriptions.filter((prescription) => {
        return prescription.patientId == patientList[sidebarIndex]._id;
      });

      setVisblePrescriptions(filteredPrescriptions);
    } else {
      setVisblePrescriptions([]);
    }
  }, [sidebarIndex, prescriptions, patientList]);

  if (visblePrescriptions && visblePrescriptions.length != 0) {
    return (
      <div className="pt-5">
        <div className="font-bold text-2xl">Prescriptions:</div>
        {visblePrescriptions!.map(
          (prescription: Prescription, index: number) =>
            prescription.name &&
            prescription.name != "" && (
              <div className="bg-gray-300 flex rounded-2xl px-3 py-2 my-5">
                <div className="flex-col grow">
                  <div className="">
                    <div>Prescription: {prescription.name}</div>
                  </div>
                  <div className="">
                    <div>
                      # of refills: {prescription.remainingRefills ?? 0}
                    </div>
                  </div>
                </div>
                {prescription.requestedRefills > 0 &&
                  lastUpdatedId != prescription._id && (
                    <div className="flex flex-row items-center space-x-2">
                      <div className="font-bold">
                        Requesting {prescription.requestedRefills} extra refills
                      </div>
                      <div className=" space-x-5">
                        <Button
                          radius="lg"
                          onClick={async () => {
                            await updateRequest(prescription._id, false);
                          }}
                          className={`text-md bg-[#d2222d] w-[5vw]`}
                        >
                          Deny
                        </Button>
                      </div>
                      <div className="float-right">
                        <Button
                          radius="lg"
                          onClick={async () => {
                            await updateRequest(prescription._id, true);
                          }}
                          className={`text-md bg-[#007000] w-[5vw]`}
                        >
                          Approve
                        </Button>
                      </div>
                    </div>
                  )}
              </div>
            )
        )}
      </div>
    );
  } else {
    return <></>;
  }
};
