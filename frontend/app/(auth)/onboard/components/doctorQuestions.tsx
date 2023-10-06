import React, { useState } from "react";
import { Checkbox, CheckboxGroup } from "@nextui-org/react";

const DoctorQuestions = () => {
  const questions = [
    {
      question: "What is the name of your clinic",
      placeholder: "HealthAid",
    },
    {
      question: "What is your speciality (select all that apply)",
      placeholder: [
        "Pediatrics",
        "Obstetrics and Gynecology (OB/GYN)",
        "Cardiology",
        "Dermatology",
        "Infectious Disease",
      ],
    },
    {
      question: "What city are you located in?",
      placeholder: "Los Angeles, California",
    },
    {
      question: "What is your clinic's phone number",
      placeholder: "+1 (501)-400-5001",
    },
  ];

  const [answers, setAnswers] = useState(Array(questions.length).fill(""));
  const [specialities, setSpecialities] = useState([]); // State for selected specialities

  const handleInputChange = (index: number, value: string | string[]) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  return (
    <div className="flex-grow">
      <form className="flex flex-wrap w-[50vw]">
        {questions.map((question, index) => (
          <div key={index} className="mb-4 w-1/2 px-5">
            {/* Add w-1/2 to make each element take half of the container's width */}
            <label className="block text-2xl font-bold text-gray-700">
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
                className="border rounded w-full py-2 px-3 mt-1"
                placeholder={question.placeholder}
                value={answers[index]}
                onChange={(e) => handleInputChange(index, e.target.value)}
              />
            )}
          </div>
        ))}
      </form>
    </div>
  );
};

export default DoctorQuestions;
