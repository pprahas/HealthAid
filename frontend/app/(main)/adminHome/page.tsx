"use client";
import { title } from "@/components/primitives";
import { useEffect, useState } from "react";
import { Patient, PatientDefault } from "@/types";
import axios from "axios";
import { Button } from "@nextui-org/button";
import { Checkbox, CheckboxGroup } from "@nextui-org/react";

export default function AdminHomePage() {
  const [user, setUser] = useState<Patient>(PatientDefault);
  const [requests, setRequests] = useState<any[]>([]); // Update the type if necessary
  const [result, setResult] = useState<{ [key: string]: string }>({});
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string[] }>({});

  function getUserObject() {
    let userObjectString = localStorage.getItem("user") ?? "";
    let userObject = JSON.parse(userObjectString);
    setUser(userObject);

    // Redirect to /home if the user's email is not 'admin@healthaid.com'
    if (userObject.email !== "admin@healthaid.com") {
      window.location.href = "/home";
    }
  }

  const handleApprovalAndDenial = async () => {
    for (const email in selectedOptions) {
      const selectedOption = selectedOptions[email][0]; // Assuming only one checkbox can be selected at a time
      const selectedRequest = requests.find((request) => request.doctorEmail === email);
      if (selectedOption === "approve" && selectedRequest) {
        // Perform approval action for the specific request
        // await handleApproval(selectedRequest);
        const reviewRequestResponse = await axios.post(
          "http://localhost:8080/reviewRequest",
          {
            doctorEmail: selectedRequest.doctorEmail,
            approval: true,
          }
        );
        const data = await reviewRequestResponse.data;
        console.log("data:", data);
        console.log(`Approved ${selectedRequest.doctorEmail}`);
      } else if (selectedOption === "deny" && selectedRequest) {
        const reviewRequestResponse = await axios.post(
          "http://localhost:8080/reviewRequest",
          {
            doctorEmail: selectedRequest.doctorEmail,
            approval: false,
          }
        );
        const data = await reviewRequestResponse.data;
        console.log("data:", data);
        console.log(`Denied ${selectedRequest.doctorEmail}`);
      }
    }
    window.location.reload();
  };

  async function getAllRequests() {
    try {
      const response = await axios.post("http://localhost:8080/getRequest", {});
      setRequests(response.data); // Assuming response.data contains the requests
    } catch (error) {
      console.log(error);
    }
  }

  function bufferToDataUrl(buffer: { data: Iterable<number>; }) {
    const bytes = new Uint8Array(buffer.data);
    const blob = new Blob([bytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    return url;
  }

  useEffect(() => {
    getAllRequests();
    getUserObject();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h1 className={title()} style={{ marginBottom: "20px" }}>
        Doctor Requests Pending Approval
      </h1>
      {requests.map((request, index) => (
        <div key={index} style={{ marginBottom: "20px" }}>
          <p>Doctor Email: {request.doctorEmail}</p>
          <p>NPI: {request.npi}</p>
          <div>
            <p>Diploma:</p>
            <iframe
              src={bufferToDataUrl(request.diploma)}
              title={`Diploma-${index}`}
              width="400"
              height="600"
              style={{ margin: "0 auto" }}
            />
          </div>
          <CheckboxGroup
            label="Approve or Deny this Doctor"
            orientation="horizontal"
            color="secondary"
            value={selectedOptions[request.doctorEmail] || []} // Set the value based on the selectedOptions object
            onChange={(value) => {
              const updatedOptions = { ...selectedOptions };
              updatedOptions[request.doctorEmail] = value as string[]; // Type assertion
              setSelectedOptions(updatedOptions);
            }}
          >
            <Checkbox value="approve">Approve</Checkbox>
            <Checkbox value="deny">Deny</Checkbox>
          </CheckboxGroup>
        </div>
      ))}
      <div className="pt-[3vh] flex justify-center">
        <Button
          className="flex w-full justify-center font-semibold leading-6 text-white shadow-sm hover:bg-secondary-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          color="success"
          onClick={handleApprovalAndDenial} // Call the function to handle approval and denial
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
