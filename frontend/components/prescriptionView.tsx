import { Prescription } from "@/types";
import { Button } from "@nextui-org/button";
import axios, { AxiosError } from "axios";
import { SetStateAction, useEffect, useState } from "react";
import {Divider} from "@nextui-org/divider";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from "@nextui-org/dropdown";


interface ChildProps {
    prescription: Prescription;
    allowRefill: boolean;
}

interface numberObject {
  key: number,
  value: number
}

  export const PrescriptionView = ({ prescription, allowRefill }: ChildProps) => {

    const [status, setStatus] = useState(-1)

    if (status == -1 && prescription.status != null) {
      setStatus(prescription.status)
    }

    if (status == -1 && prescription.requestedRefills != null && prescription.requestedRefills != 0) {
      console.log(prescription.requestedRefills)
      setStatus(0)
    }

    const [selectedNumber, setSelectedNumber] = useState(new Set([1]));
    let allNumbers: numberObject[] = [];
    for (let i = 1; i <= 10; i++) {
      allNumbers.push({key: i, value: i})
    }

    const prescriptionStatusMessage: Map<number, String> = new Map([
      [-1, "Request Refill"],
      [0, "Pending approval"],
      [1, "Request denied"],
      [2, "Request approved"],
    ]);
  
    const prescriptionStatusColor: Map<number, String> = new Map([
      [-1, "bg-white"],
      [0, "bg-[#ffbf00]"],
      [2, "bg-[#007000]"],
      [1, "bg-[#d2222d]"],
    ]);

    const handleSendRequest = async() => {
      try {
        const [num] = selectedNumber
        await axios.post(
          "http://localhost:8080/prescription/requestedRefills",
          {
            prescriptionId: prescription._id,
            requestedRefills: num,
          }
        );
        setStatus(0)
      } catch (error) {
        console.error("Error:", error);
      }
    }

    return(
      <div className="bg-slate-200 py-2 px-4 rounded-2xl shadow-sm">
        <div className="flex flex-col">
          <div className="flow-root">
            <div className="text-4xl float-left">
              {'\u211E'}
            </div>
            <div className="float-right">
              {prescription.date != undefined &&
                <div>
                  Assigned {prescription.date.substring(0, 10)}
                </div>
              }
            </div>
          </div>
          
          <div className="font-bold text-2xl">
            {prescription.name}
          </div>
          
          <div>
            {prescription.reminderCycle}
            {
              allowRefill == true &&
              
              <div className="flow-root">
                <Divider className="my-4"/>
                <div className="float-left">
                  

                Number of refills: 
                <Dropdown
                classNames={{
                  base: "bg-white",
                }}
              >
                <DropdownTrigger>
                  <Button
                    radius="lg"
                    color="primary"
                    variant="flat"
                    className="text-md ml-1"
                  >
                    {selectedNumber}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Number of refills selection"
                  variant="solid"
                  color="primary"
                  disallowEmptySelection
                  selectionMode="single"
                  selectedKeys={selectedNumber}
                  items={allNumbers}
                  onSelectionChange={setSelectedNumber}
                >
                  {(item) => (
                    <DropdownItem key={item.key}>
                      {item.value}
                    </DropdownItem>
                  )}
                </DropdownMenu>
              </Dropdown>
              </div>
              <div className="float-right">
                
                <Button 
                  onClick={async () => {
                    if (status == -1) {
                      await handleSendRequest();
                    }
                  }}
                  className={`text-md ${prescriptionStatusColor.get(
                    status
                )} w-[10vw]`}>
                  {prescriptionStatusMessage.get(status)}
                </Button>
                </div>
              </div>
              
            }
          </div>
          
        </div>
      </div>
    )
  };
  