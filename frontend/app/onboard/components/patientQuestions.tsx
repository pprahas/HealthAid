import React, { useState } from "react";
import { Button } from "@nextui-org/button";
import axios, { AxiosError } from "axios";

const PatientQuestions = () => {
  const questions = [
    {
      question: "Any allergies?",
      placeholder: "Penicillin",
    },
    {
      question: "Chronic conditions?",
      placeholder: "Diabetes",
    },
    {
      question: "Current medications?",
      placeholder: "Daily Multivitamins",
    },
    {
      question: "Current symptoms or concerns?",
      placeholder: "Occasional headaches",
    },
    {
      question: "Pain level (1-10)?",
      placeholder: "4",
    },
    {
      question: "Current pain or discomfort?",
      placeholder: "Lower back pain",
    },
    {
      question: "Recent weight changes?",
      placeholder: "Lost 5 pounds in the last month",
    },
    {
      question: "Exercise routine?",
      placeholder: "Workout 3-5 times a week",
    },
    {
      question: "Dietary restrictions?",
      placeholder: "Gluten-free",
    },
    {
      question: "Alcohol consumption habits?",
      placeholder: "1-2 drinks per week",
    },
    {
      question: "Tobacco or smoking habits?",
      placeholder: "Quit 2 years ago",
    },
    {
      question: "Stress level (1-10)?",
      placeholder: "7",
    },
    {
      question: "Sleep patterns?",
      placeholder: "6-7 hours per night",
    },
    {
      question: "History of mental health treatment?",
      placeholder: "Diagnosed with Anxiety",
    },
    {
      question: "Pregnancy plans (for females)?",
      placeholder: "Planning to start a family within the year",
    },
    {
      question: "Family health history?",
      placeholder: "Family history of heart disease...",
    },
    {
      question: "Past surgeries or procedures?",
      placeholder: "Appendectomy in December 2022",
    },
    {
      question: "Recent travel destinations?",
      placeholder: "Visited France and Italy this past summer",
    },
    {
      question:
        "Have you ever had any adverse reactions to medications or treatments in the past?",
      placeholder: "Experienced a rash from antibiotics once",
    },
    {
      question:
        "Have you ever had any surgeries on your eyes or vision-related procedures?",
      placeholder: "Had LASIK surgery in March 2023",
    },
  ];

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (question: string, value: string): void => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [question]: value,
    }));
  };

  async function handleRegister() {
    try {
      setLoading(true);
      let currUserObject = fetchUserData();
      const updateHealthInfoResponse = await axios.post(
        "http://localhost:8080/patient_health_information",
        {
          email: currUserObject.email,
          information: answers,
        }
      );

      console.log("Update health response:", updateHealthInfoResponse.data);
      const updateHealthInfoData = await updateHealthInfoResponse.data;
      console.log(updateHealthInfoData.patient);
      setLoading(false);
      window.location.href = "/home";
    } catch (error) {
      const axiosError = error as AxiosError;
      let errorText = axiosError.response?.data;
      console.log(errorText);
      setError("" + errorText);
    }
  }

  function fetchUserData() {
    let userObjectString = localStorage.getItem("user") ?? "";
    let userObject = JSON.parse(userObjectString);
    return userObject;
  }

  return (
    <div className="flex-grow">
      <form className="flex flex-wrap w-[50vw] items-center justify-center">
        {questions.map((question, index) => (
          <div key={index} className="mb-4 w-1/2 px-5">
            <label className="block text-gray-700">{question.question}</label>
            <input
              type="text"
              className="border rounded w-full py-2 px-3 mt-1"
              placeholder={question.placeholder}
              value={answers[question.question] || ""}
              onChange={(e) =>
                handleInputChange(question.question, e.target.value)
              }
            />
          </div>
        ))}
        <div className="pt-[3vh]">
          <Button
            isLoading={loading}
            type="submit"
            onClick={handleRegister}
            className="flex w-full justify-center rounded-md bg-indigo-600 px-2 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Finished!
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PatientQuestions;