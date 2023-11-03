import {
  Conversation,
  Doctor,
  Message,
  Patient,
  PatientDefault,
} from "@/types";
import { Avatar } from "./messageAvatar";
import {
  ConvoListContext,
  CurrentConvoContext,
  DoctorListContext,
  PatientContext,
} from "@/app/(main)/layout";
import { useContext, useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Button } from "@nextui-org/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from "@nextui-org/dropdown";

interface chatProps {
  messages: Message[];
}

export const ChatContainer = ({ messages }: chatProps) => {
  const [convo, setConvo] = useContext(CurrentConvoContext) as [
    Conversation,
    React.Dispatch<React.SetStateAction<Conversation>>
  ];
  const [convoList, setConvoList] = useContext(ConvoListContext) as [
    Array<Conversation>,
    React.Dispatch<React.SetStateAction<Array<Conversation>>>
  ];

  const [patient, setPatient] = useContext(PatientContext) as [
    Patient,
    React.Dispatch<React.SetStateAction<Patient>>
  ];
  const [doctorList, setDoctorList] = useContext(DoctorListContext) as [
    Doctor[],
    React.Dispatch<React.SetStateAction<Doctor[]>>
  ];

  const [selectedKey, setSelectedKey] = useState(
    new Set(["Automatically Choose"])
  );
  const [selectedName, setSelectedName] = useState("Automatically Choose");
  const [allDoctors, setAllDoctors] = useState([] as Doctor[]);
  const [autoDoctor, setAutoDoctor] = useState("");
  const [isAuto, setIsAuto] = useState(true);
  const [sentToDoctor, setSentToDoctor] = useState(false);

  const formatDate = (dateTimeStr: string) => {
    // Convert UTC date-time string to local Date object
    const date = new Date(dateTimeStr);
    // Define arrays to get month names and ordinal numbers
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const ordinals = (n: number) => {
      if (n > 3 && n < 21) return "th";
      switch (n % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    try {
      // Extract date components
      const month = months[date.getMonth()];
      const day = date.getDate();
      const year = date.getFullYear();
      let hour = date.getHours();
      const minute = ("0" + date.getMinutes()).slice(-2); // pad with leading 0 if needed
      const ampm = hour >= 12 ? "PM" : "AM";

      // Convert 24-hour format to 12-hour format
      hour = hour % 12;
      hour = hour ? hour : 12; // the hour '0' should be '12'

      // Construct the desired format
      return `${month} ${day}${ordinals(
        day
      )} ${year} @ ${hour}:${minute} ${ampm}`;
    } catch (error) {
      return `${date}`;
    }
  };

  useEffect(() => {
    getDoctorsInNetwork();
  }, []);

  useEffect(() => {
    setAutoDoctor("");
  });

  const getDoctors = async (doctorId: string) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/getDoctorFromId",
        {
          id: doctorId,
        }
      );

      const data = await response.data;
      return data.doctor;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getDoctorsInNetwork = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/getDoctorFromId/all",
        {}
      );

      const data = await response.data;

      filterByInsurance(data);
    } catch (error) {
      console.error("Error:", error);
      return;
    }
  };

  const doctorInsurance = async (id: string) => {
    try {
      const response = await axios.post("http://localhost:8080/getClinic", {
        clinicId: id,
      });

      const data = await response.data;
      return data.clinic.network;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const filterByInsurance = async (doctorList: Doctor[]) => {
    let newDoctorList = [] as Doctor[];

    const defaultDoctor = {
      _id: "Automatically Choose",
      firstName: "Automatically",
      lastName: "Choose",
      patients: [],
      email: "Automatically Choose",
    };
    newDoctorList.push(defaultDoctor);

    for (let i = 0; i < doctorList.length; i++) {
      if (doctorList[i].clinic != undefined) {
        let insurance = await doctorInsurance(doctorList[i].clinic as string);
        if (insurance === undefined) continue;
        if (insurance.includes(patient.insurance, 0)) {
          doctorList[i].firstName = "Dr. " + doctorList[i].firstName;
          newDoctorList.push(doctorList[i]);
        }
      }
    }

    setAllDoctors(newDoctorList);
  };

  async function getAllDoctors() {
    if (patient && patient.doctors != undefined) {
      try {
        const allDoctorData: Doctor[] = [
          {
            _id: "gpt",
            firstName: "Chat",
            lastName: "GPT",
            email: "chatgpt@openai.com",
            patients: Array(1).fill(PatientDefault),
            activeAccount: true,
          },
        ];
        const doctorDataDatabase = await Promise.all(
          patient.doctors.map(getDoctors)
        );
        allDoctorData.push(...doctorDataDatabase);
        setDoctorList(allDoctorData);
      } catch (error) {}
    } else {
      setDoctorList([]);
    }
  }

  const handleSendToDoctor = async () => {
    setSentToDoctor(true);
    let email = selectedKey.values().next().value;
    console.log("1: ", allDoctors[0].email);
    console.log("2: ", allDoctors[1].email);
    if (email === "Automatically Choose") {
      email = allDoctors[1].email;
    } else {
      setIsAuto(false);
    }
    try {
      const updateDiagnosisResponse = await axios.post(
        "http://localhost:8080/updateDiagnosis",
        {
          diagnosis: "pending",
          conversationId: convo._id,
          doctorEmail: email,
        }
      );
      convo.diagnosis = "pending";
      setAutoDoctor(allDoctors[1].firstName + " " + allDoctors[1].lastName);
      await getAllDoctors();
      const data = (await updateDiagnosisResponse.data) as string;
      const updateDoctorsResponse = await axios.post(
        "http://localhost:8080/updatePatient",
        {
          patientId: patient._id,
          add: {
            doctors: `${data}`,
          },
        }
      );
      let currPatient = Object.assign({}, data) as Patient;
      if (currPatient.doctors) {
        currPatient.doctors.push(`${data}`);
      } else {
        currPatient.doctors = [`${data}`];
      }
      setPatient(currPatient);
      return data.doctor;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const diagnosisStatusMessage: Map<String, String> = new Map([
    ["none", "Send to Doctor"],
    ["pending", "Pending approval"],
    ["approved", "Approved"],
    ["denied", "Denied"],
  ]);

  const diagnosisStatusColor: Map<String, String> = new Map([
    ["none", "bg-white"],
    ["pending", "bg-[#ffbf00]"],
    ["approved", "bg-[#007000]"],
    ["denied", "bg-[#d2222d]"],
  ]);

  useEffect(() => {
    console.log("count: ", messages.length);
    let lastMessage = messages[messages.length - 1];
    console.log("last message: ", lastMessage);
    if (lastMessage) {
      if (lastMessage.content.toLowerCase().includes("diagnosis: ")) {
        if (convo.diagnosis == "none") {
          console.log("auto send to doctor");
          if (allDoctors.length > 0) {
            handleSendToDoctor();
          }
        }
        setSentToDoctor(true);
      }
    }
  }, [messages, allDoctors]);

  return (
    <div className="h-full mr-10">
      <div className="bg-gray-300 rounded-2xl px-3 py-2 flow-root">
        <div className="float-left flex flex-row items-center">
          {convo.diagnosis === "none" && (
            <div>
              Send to:
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
                    className="ml-2 text-md"
                  >
                    {selectedName}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Doctor selection"
                  variant="solid"
                  color="primary"
                  disallowEmptySelection
                  selectionMode="single"
                  selectedKeys={selectedKey}
                  onSelectionChange={setSelectedKey}
                  onAction={(key) => {
                    let selectedDoctor = allDoctors.find(
                      (i) => i.email === key
                    );
                    if (selectedDoctor !== undefined) {
                      setSelectedName(
                        selectedDoctor.firstName + " " + selectedDoctor.lastName
                      );
                    }
                  }}
                  items={allDoctors}
                >
                  {(item) => (
                    <DropdownItem key={item.email}>
                      {item.firstName} {item.lastName}
                    </DropdownItem>
                  )}
                </DropdownMenu>
              </Dropdown>
            </div>
          )}
          {autoDoctor !== "" && (
            <>
              {isAuto ? (
                <div className="text-md mt-2">
                  {/* Automatically sent to {autoDoctor} */}
                </div>
              ) : (
                <div className="text-md mt-2">Sent to {autoDoctor}</div>
              )}
            </>
          )}
        </div>

        <div className="float-right">
          <Button
            radius="lg"
            disabled={convo.diagnosis != "none"}
            onClick={async () => {
              if (convo.diagnosis == "none") {
                await handleSendToDoctor();
              }
            }}
            className={`text-md ${diagnosisStatusColor.get(
              convo.diagnosis
            )} w-[10vw]`}
          >
            {diagnosisStatusMessage.get(convo.diagnosis)}
          </Button>
        </div>
      </div>

      {messages &&
        messages.map((message: Message, index: number) => (
          <div key={index}>
            {message.senderType === "gpt" && (
              <div>
                <div className="py-2 flex flex-row items-end justify-start">
                  <div className="">
                    <Avatar sender={message.senderType} />
                  </div>
                  <div className="flex flex-col ">
                    <div
                      style={{ whiteSpace: "pre-wrap" }}
                      className="px-2 max-w-[calc(100%-20%)] py-2 flex flex-col rounded-2xl text-white shadow-md ml-2 bg-gradient-to-r from-blue-800 to-indigo-800"
                    >
                      <span className="text-md">
                        {message.content
                          .replaceAll("**nn**", "\n")
                          .replaceAll("*", "")}
                      </span>
                    </div>
                    <div className="ml-2">{formatDate(`${message.date}`)}</div>
                  </div>
                </div>
              </div>
            )}
            {message.senderType !== "gpt" && (
              <div>
                <div className="py-2 flex flex-row items-end justify-end">
                  <div className="flex flex-col">
                    <div
                      style={{ whiteSpace: "pre-wrap" }}
                      className="px-2 max-w-[calc(100%-20%)] py-2 flex flex-col rounded-2xl text-white shadow-md mr-2 bg-gradient-to-l from-gray-500 to-slate-700"
                    >
                      <div className="text-md">
                        {message.content
                          .replaceAll("**nn**", "\n")
                          .replaceAll("*", "")}
                      </div>
                    </div>
                    <div className="ml-2">{formatDate(`${message.date}`)}</div>
                  </div>
                  <div>
                    <Avatar sender={message.senderType} />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
    </div>
  );
};
