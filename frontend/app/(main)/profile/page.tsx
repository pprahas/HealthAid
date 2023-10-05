"use client";
import { title } from "@/components/primitives";
import React, { useState } from "react";

interface FormData {
  [key: string]: string;
}

export default function ProfilePage() {
  // State for personal information
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    birthday: "",
    address: "",
    gender: "",
    newPassword: "", // New password field
    confirmPassword: "", // Confirm password field
  });

  const [questions, setQuestions] = useState([
    { id: 1, question: "Question 1", answer: "" },
    { id: 2, question: "Question 2", answer: "" },
    { id: 3, question: "Question 3", answer: "" },
    { id: 4, question: "Question 4", answer: "" },
    { id: 5, question: "Question 5", answer: "" },
  ]);

  const handleSave = () => {
    if (formData.newPassword === formData.confirmPassword) {
      // Passwords match, you can proceed
      console.log("Personal Info:", formData);
    } else {
      // Passwords don't match, show an error message or take appropriate action
      console.error("Passwords do not match");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    setFormData({
      ...formData,
      [fieldName]: e.target.value,
    });
  };

  const handleQuestionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    const updatedQuestions = questions.map((q) =>
      q.id === id ? { ...q, answer: e.target.value } : q
    );
    setQuestions(updatedQuestions);
  };

  // Define an array of field names for personal information
  const personalInfoFields = [
    { label: "First Name", name: "firstName" },
    { label: "Last Name", name: "lastName" },
    { label: "Birthday", name: "birthday" },
    { label: "Address", name: "address" },
    { label: "Gender", name: "gender" },
    { label: "New Password", name: "newPassword", type: "password" }, // New password field
    { label: "Confirm Password", name: "confirmPassword", type: "password" }, // Confirm password field
  ];

  return (
    <div>
      <div style={{ display: "flex" }}>
        {/* Left Side: Personal Information */}
        <div style={{ flex: 1 }}>
          <div className="inline-block max-w-lg text-center justify-center">
            <h1 className="text-3xl font-bold mb-4">Personal Information</h1>
          </div>
          {personalInfoFields.map((field) => (
            <div className="mb-4" key={field.name}>
              <div className="mb-2">
                <label className="text-xl font-bold">{field.label}:</label>
              </div>
              <input
                type="text"
                placeholder={field.label}
                className="border p-2 rounded"
                value={formData[field.name]}
                onChange={(e) => handleFieldChange(e, field.name)}
              />
            </div>
          ))}
        </div>

        {/* Right Side: Health Questions */}
        <div style={{ flex: 1 }}>
          <div className="inline-block max-w-lg text-center justify-center">
            <h1 className="text-3xl font-bold mb-4">Health Information</h1>
          </div>
          {questions.map((q) => (
            <div className="mb-4" key={q.id}>
              <div className="mb-2">
                <label className="text-xl font-bold">{q.question}:</label>
              </div>
              <input
                type="text"
                placeholder=""
                className="border p-2 rounded"
                value={q.answer}
                onChange={(e) => handleQuestionChange(e, q.id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <button
        className="bg-blue-500 text-white p-4 rounded hover:bg-blue-600 mr-4"
        onClick={handleSave}
      >
        Save
      </button>
      <button
        className="bg-red-500 text-white p-4 rounded hover:bg-red-600 mr-4"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}
