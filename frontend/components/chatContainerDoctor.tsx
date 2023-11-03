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
  DoctorContext,
  PatientContext,
} from "@/app/doctor/layout";
import { useContext, useEffect } from "react";
import axios from "axios";

interface chatProps {
  messages: Message[];
}

export const ChatContainerDoctor = ({ messages }: chatProps) => {
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
  const [doctor, setDoctor] = useContext(DoctorContext) as [
    Doctor,
    React.Dispatch<React.SetStateAction<Doctor>>
  ];
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

  useEffect(() => {}, [convo]);

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

  const diagnosisStatusMessage: Map<String, String> = new Map([
    ["none", "Send to Doctor"],
    ["pending", "Pending approval from doctor"],
    ["approved", "Approved"],
    ["denied", "Denied"],
  ]);

  const diagnosisStatusColor: Map<String, String> = new Map([
    ["none", "bg-white"],
    ["pending", "bg-[#ffbf00]"],
    ["approved", "bg-[#007000]"],
    ["denied", "bg-[#d2222d]"],
  ]);

  const handleApprove = async (conversationId: String) => {
    try {
      const updateDiagnosisResponse = await axios.post(
        "http://localhost:8080/updateDiagnosis",
        {
          diagnosis: "approved",
          conversationId: convo._id,
          doctorEmail: doctor.email,
        }
      );
      let convoCopy = Object.assign({}, convo);
      convoCopy.diagnosis = "approved";
      setConvo(convoCopy);
      const data = await updateDiagnosisResponse.data;
      return data.doctor;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeny = async (conversationId: String) => {
    try {
      const updateDiagnosisResponse = await axios.post(
        "http://localhost:8080/updateDiagnosis",
        {
          diagnosis: "denied",
          conversationId: conversationId,
          doctorEmail: doctor.email,
        }
      );
      let convoCopy = Object.assign({}, convo);
      convoCopy.diagnosis = "denied";
      setConvo(convoCopy);
      const data = await updateDiagnosisResponse.data;
      return data.doctor;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="h-full mr-10">
      {convo.diagnosis == "pending" && (
        <div className="flex gap-x-3 pb-3 items-center justify-center">
          <div
            onClick={() => {
              handleDeny(convo._id);
            }}
            className={`py-3 px-5 text-center border-white bg-[#d2222d] text-white border-2 hover:border-black rounded-2xl w-[10vw]`}
          >
            Deny
          </div>
          <div
            onClick={() => {
              handleApprove(convo._id);
            }}
            className={`py-3 px-5 text-center border-white bg-[#007000] text-white border-2 hover:border-black rounded-2xl w-[10vw]`}
          >
            Approve
          </div>
        </div>
      )}
      {convo.diagnosis == "approved" && (
        <div className="flex gap-x-3 pb-3 items-center justify-center">
          <div
            className={`py-3 px-5 text-center border-white bg-[#007000] text-white border-2 hover:border-black rounded-2xl w-[10vw]`}
          >
            Approved!
          </div>
        </div>
      )}
      {convo.diagnosis == "denied" && (
        <div className="flex gap-x-3 pb-3 items-center justify-center">
          <div
            className={`py-3 px-5 text-center border-white bg-[#d2222d] text-white border-2 hover:border-black rounded-2xl w-[10vw]`}
          >
            Denied!
          </div>
        </div>
      )}
      {messages &&
        messages.map((message: Message, index: number) => (
          <div>
            {message.senderType == "gpt" && (
              <div>
                <div className="py-2 flex flex-row items-end justify-start">
                  <div className="">
                    <Avatar sender={message.senderType} />
                  </div>
                  <div className="flex flex-col ">
                    <div className="px-2 max-w-[calc(100%-20%)] py-2 flex flex-col rounded-2xl text-white shadow-md ml-2 bg-gradient-to-r from-blue-800 to-indigo-800">
                      <span className="text-md">{message.content}</span>
                    </div>
                    <div className="ml-2">{formatDate(`${message.date}`)}</div>
                  </div>
                </div>
              </div>
            )}
            {message.senderType != "gpt" && (
              <div>
                <div className="py-2 flex flex-row items-end justify-end">
                  <div className="flex flex-col ">
                    <div className="px-2 max-w-[calc(100%-20%)] py-2 flex flex-col rounded-2xl text-white shadow-md mr-2 bg-gradient-to-l from-gray-500 to-slate-700">
                      <span className="text-md">{message.content}</span>
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
