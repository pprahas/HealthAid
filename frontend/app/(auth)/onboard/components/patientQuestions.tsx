import React, { useEffect, useState } from "react";
import { Button } from "@nextui-org/button";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";

const PatientQuestions = () => {
  const router = useRouter();

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
    // {
    //   question: "Which insurance are you currently using?",
    //   options: [
    //     "UnitedHealth Group",
    //     "Elevance Health (formerly Anthem)",
    //     "Centene",
    //     "Kaiser Permanente",
    //     "Humana",
    //     "CVS Health",
    //     "HCSC (Health Care Service Corporation)",
    //     "Cigna",
    //     "Molina Healthcare",
    //     "GuideWell",
    //   ],
    // },
  ];

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [insurance, setInsurance] = useState("");
  const [reminders, setReminders] = useState("Yes");
  // const [remindersValue, setRemindersValue] = useState("");
  const [deliveryOption, setDeliveryOption] = useState("Delivery");
  const [error, setError] = useState("");

  const handleInputChange = (question: string, value: string): void => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [question]: value,
    }));
  };

  async function handleRegister() {
    if (answers != undefined) {
      try {
        setLoading(true);
        let currUserObject = fetchUserData();
        const updateHealthInfoResponse = await axios.post(
          "http://localhost:8080/patientHealthInformation",
          {
            email: currUserObject.email,
            information: answers,
          }
        );

        let record: Record<string, string> = {};
        record["insurance"] = insurance;
        record["reminders"] = reminders;
        // record["remindersValue"] = remindersValue;
        record["deliveryOption"] = deliveryOption;

        const response = await axios.post(
          "http://localhost:8080/updatePatient",
          {
            patientId: currUserObject._id,
            add: record,
          }
        );

        const updateHealthInfoData = await updateHealthInfoResponse.data;
        setLoading(false);

        //window.location.href = "/home";
        if (currUserObject.email === "admin@healthaid.com") {
          router.push("/adminHome");
        } else {
          router.push("/home");
        }
      } catch (error) {
        const axiosError = error as AxiosError;
        let errorText = axiosError.response?.data;
        setError("" + errorText);
      }
    }
  }

  useEffect(() => {
    questions.forEach((question) => {
      setAnswers((prevAnswers) => ({
        ...prevAnswers,
        [question.question]: " ",
      }));
    });
  }, []);

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
              className="p-4 shadow-sm rounded-xl bg-gray-100 hover:bg-gray-200 transition duration-200"
              placeholder={question.placeholder}
              value={answers[question.question] || ""}
              onChange={(e) =>
                handleInputChange(question.question, e.target.value)
              }
            />
          </div>
        ))}

        {/* <div className="mb-4 w-1/2 px-5">
          <label className="block text-gray-700">Insurance</label>

          <input
            type="text"
            className="p-4 shadow-sm rounded-xl bg-gray-100 hover:bg-gray-200 transition duration-200"
            placeholder="insurance"
            value="insurance"
            // onChange={(e) =>
            //   handleInputChange(question.question, e.target.value)
            // }
            <option value="">Select an insurance</option>
  <option value="option1">Option 1</option>
  <option value="option2">Option 2</option>
  <option value="option3">Option 3</option>

          />
        </div> */}

        <div className="mb-4 w-1/2 px-5">
          <label className="block text-gray-700">Insurance</label>
          <select
            className="p-4 shadow-sm rounded-xl bg-gray-100 hover:bg-gray-200 transition duration-200"
            value={insurance}
            // onChange={(e) => handleInputChange("Insurance", e.target.value)}
            onChange={(e) => setInsurance(e.target.value)}
          >
            <option value="UnitedHealth Group">UnitedHealth Group</option>
            <option value="Elevance Health (formerly Anthem)">
              Elevance Health (formerly Anthem)
            </option>
            <option value="Centene">Centene</option>
            <option value="Kaiser Permanente">Kaiser Permanente</option>
            <option value="Humana">Humana</option>
            <option value="CVS Health">CVS Health</option>
            <option value="HCSC (Health Care Service Corporation)">
              HCSC (Health Care Service Corporation)
            </option>
            <option value="Cigna">Cigna</option>
            <option value="Molina Healthcare">Molina Healthcare</option>
            <option value="GuideWell">GuideWell</option>
          </select>
        </div>
        <div className="mb-4 w-1/2 px-5">
          <label className="block text-gray-700">Reminders</label>

          <select
            className="p-4 shadow-sm rounded-xl bg-gray-100 hover:bg-gray-200 transition duration-200"
            value={reminders}
            // onChange={(e) => handleInputChange("Insurance", e.target.value)}
            onChange={(e) => setReminders(e.target.value)}
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          {/* <label className="block text-gray-700">Value</label> */}

          {/* <input
            type="text"
            className="p-4 shadow-sm rounded-xl bg-gray-100 hover:bg-gray-200 transition duration-200"
            placeholder="Value"
            value={remindersValue}
            onChange={(e) => setRemindersValue(e.target.value)}
          /> */}
        </div>
        <div className="mb-4 w-1/2 px-5">
          <label className="block text-gray-700">
            How would you like to receive prescriptions?
          </label>
          <select
            className="p-4 shadow-sm rounded-xl bg-gray-100 hover:bg-gray-200 transition duration-200"
            value={deliveryOption}
            onChange={(e) => setDeliveryOption(e.target.value)}
          >
            <option value="Delivery">Delivery</option>
            <option value="Pick Up">Pick up</option>
          </select>
        </div>
        {/* {questions.map((question, index) => (
          <div key={index} className="mb-4 w-1/2 px-5">
            <label className="block text-gray-700">{question.question}</label>
            {Array.isArray(question.options) ? (
              <select
                value={answers[question.question] || ""}
                onChange={(e) =>
                  handleInputChange(question.question, e.target.value)
                }
                className="p-4 shadow-sm rounded-xl bg-gray-100 hover:bg-gray-200 transition duration-200"
              >
                <option value="">Select an option</option>
                {question.options.map((option, optionIndex) => (
                  <option key={optionIndex} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                className="p-4 shadow-sm rounded-xl bg-gray-100 hover-bg-gray-200 transition duration-200"
                placeholder={question.placeholder}
                value={answers[question.question] || ""}
                onChange={(e) =>
                  handleInputChange(question.question, e.target.value)
                }
              />
            )}
          </div>
        ))} */}
      </form>
      <div className="flex justify-center">
        <div className="pt-[3vh] w-1/5 flex items-center justify-center">
          <Button
            isLoading={loading}
            type="submit"
            onClick={handleRegister}
            color="success"
            className="flex w-full justify-center rounded-md px-2 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-secondary-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Finished!
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PatientQuestions;
