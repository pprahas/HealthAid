import React, { useState } from "react";
import { Checkbox, CheckboxGroup } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import axios, { AxiosError } from "axios";
import { Input } from "@nextui-org/input";

const DoctorQuestions = () => {
  const questions = [
    {
      question: "What is the name of your clinic?",
      placeholder: "HealthAid",
      key: "name",
    },
    {
      question: "What is your postal code?",
      placeholder: "01234",
      key: "postalCode",
    },
    {
      question: "What is the name of your website?",
      placeholder: "https:your-website.com",
      key: "website",
    },
    {
      question: "What is your clinic's phone number?",
      placeholder: "+1 (501)-400-5001",
      key: "phoneNumber",
    },
    {
      question: "What is your specialty? (select all that apply)",
      placeholder: [
        "Pediatrics",
        "Obstetrics and Gynecology (OB/GYN)",
        "Cardiology",
        "Dermatology",
        "Infectious Disease",
      ],
      key: "specialties",
    },
    {
      question: "What is your address?",
      placeholder: "Los Angeles, California",
      key: "address",
    },
    {
      question:
        "Which insurance network(s) is your clinic affiliated with? (select all that apply)",
      placeholder: [
        "UnitedHealth Group",
        "Elevance Health",
        "Centene",
        "Kaiser Permanente",
        "Humana",
        "CVS Health",
        "HCSC",
        "Cigna",
        "Molina Healthcare",
        "GuideWell",
      ],
      key: "network",
    },
  ];

  const clinicInfoKeys = [
    "name",
    "postalCode",
    "website",
    "phoneNumber",
    "specialties",
    "address",
    "network",
  ];

  const [answers, setAnswers] = useState(Array(questions.length).fill(""));
  const [specialities, setSpecialities] = useState([]); // State for selected specialities
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [buffer, setBuffer] = useState<Buffer | null>(null);
  const [npi, setNpi] = useState("");


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const uploadedFile = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const arrayBuffer = event.target.result as ArrayBuffer;
          const buffer = Buffer.from(arrayBuffer);
          setBuffer(buffer);
          console.log("converted buffer:", buffer);
        }
      };
      reader.readAsArrayBuffer(uploadedFile);
    }
  };

  const handleInputChange = (index: number, value: string | string[]) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  async function handleRegister() {
    if (answers.every((answer) => answer !== "")) {
      try {
        setLoading(true);
        let currUserObject = fetchUserData();

        const clinicInfo = {} as { [key: string]: string };

        clinicInfoKeys.forEach((key, index) => {
          clinicInfo[key] = answers[index];
        });

        const postData = {
          email: currUserObject.email,
          clinicInfo: clinicInfo,
        };

        const updateClinicInfoResponse = await axios.post(
          "http://localhost:8080/doctorClinicInformation",
          postData
        );

        try {
          const response = await axios.post(
            "http://localhost:8080/createRequest",
            {
              doctorEmail: currUserObject.email,
              diploma: buffer,
              npi: npi,
            }
          );
          console.log("response update" + response);
        } catch (error) {
          console.error("Error:", error);
        }

        const updateClinicInfo = await updateClinicInfoResponse.data;
        setLoading(false);
        window.location.href = "/doctor/home";
      } catch (error) {
        const axiosError = error as AxiosError;
        let errorText = axiosError.response?.data;
        setError("" + errorText);
      }
    }
  }

  function fetchUserData() {
    let userObjectString = localStorage.getItem("user") ?? "";
    let userObject = JSON.parse(userObjectString);
    return userObject;
  }

  return (
    <div className="flex-grow">
      <form className="flex flex-wrap w-[50vw]">
        {questions.map((question, index) => (
          <div key={index} className="mb-4 w-1/2 px-5">
            {/* Add w-1/2 to make each element take half of the container's width */}
            <label className="block text-lg text-gray-700">
              {question.question}
            </label>
            {Array.isArray(question.placeholder) ? ( // Check if it's an array
              <CheckboxGroup
                value={answers[index]}
                onValueChange={(value) => handleInputChange(index, value)}
              >
                {question.placeholder.map((option, optionIndex) => (
                  <Checkbox key={optionIndex} value={option}>
                    {option}
                  </Checkbox>
                ))}
              </CheckboxGroup>
            ) : (
              <input
                type="text"
                className="p-4 shadow-sm rounded-xl bg-gray-100 hover:bg-gray-200 transition duration-200"
                placeholder={question.placeholder}
                value={answers[index]}
                onChange={(e) => handleInputChange(index, e.target.value)}
              />
            )}
          </div>
        ))}
        <div key="diploma" className="mb-4 w-1/2 px-5">
          <label className="block text-lg text-gray-700">
            Upload your diploma (PDF file)
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="p-4 shadow-sm rounded-xl bg-gray-100 hover:bg-gray-200 transition duration-200"
          />
        </div>
        <div>
          <Input
            isRequired
            type="text"
            label="NPI"
            defaultValue=""
            onChange={(e) => {
              setNpi(e.target.value);
            }}
          />
        </div>
        

      </form>
      <div className="pt-[3vh] flex justify-center">

          <Button
            isLoading={loading}
            type="button"
            onClick={handleRegister}
            color="success"
            style={{ maxWidth: '200px' }}
            className="flex w-full justify-center font-semibold leading-6 text-white shadow-sm hover:bg-secondary-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Finished!
          </Button>
        </div>
    </div>
  );
};

export default DoctorQuestions;
