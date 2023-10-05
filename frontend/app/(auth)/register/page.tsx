"use client";

import React, { useState, MouseEvent, FormEvent } from "react";
import axios, { AxiosError } from "axios";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Checkbox, CheckboxGroup } from "@nextui-org/react";

export default function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submit, setSubmit] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState(["patient"]);

  const isFirstNameValid = React.useMemo(() => {
    if (firstName === "") return !submit;

    return firstName.match(/^[A-Za-z\s'-]+$/i) != null;
  }, [firstName, submit]);

  const isLastNameValid = React.useMemo(() => {
    if (lastName === "") return !submit;

    return lastName.match(/^[A-Za-z\s'-]+$/i) != null;
  }, [lastName, submit]);

  function emailCheck() {
    if (email === "") return !submit;

    return (
      email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/i) != null
    );
  }

  const isPasswordValid = React.useMemo(() => {
    if (password === "") return !submit;

    return password.match(/^[\x20-\x7E]+$/) != null;
  }, [password, submit]);

  const isConfirmPasswordValid = React.useMemo(() => {
    if (confirmPassword === "" || confirmPassword != password) return !submit;

    return password.match(/^[\x20-\x7E]+$/) != null;
  }, [confirmPassword, submit]);

  const handleGoToOnboard = async (e: MouseEvent<HTMLButtonElement>) => {
    if (
      isFirstNameValid &&
      isLastNameValid &&
      isEmailValid &&
      isPasswordValid &&
      isConfirmPasswordValid
    ) {
      e.preventDefault();
      try {
        setSubmit(true);
        if (role && role[0] == "doctor") {
          const registerResponse = await axios.post(
            "http://localhost:8080/register/doctor",
            {
              firstName: firstName,
              lastName: lastName,
              email: email,
              password: password,
              type: "doctor",
            }
          );

          console.log("Register response:", registerResponse.data);
          const registerData = await registerResponse.data;
          console.log(registerData.doctor);
          registerData.doctor.type = "doctor";
          localStorage.setItem("user", JSON.stringify(registerData.doctor));
          window.location.href = "/onboard";
        } else {
          const registerResponse = await axios.post(
            "http://localhost:8080/register/patient",
            {
              firstName: firstName,
              lastName: lastName,
              email: email,
              password: password,
              type: "patient",
            }
          );

          console.log("Register response:", registerResponse.data);
          const registerData = await registerResponse.data;
          console.log(registerData.patient);
          registerData.patient.type = "patient";
          localStorage.setItem("user", JSON.stringify(registerData.patient));
          window.location.href = "/onboard";
        }
      } catch (error) {
        const axiosError = error as AxiosError;
        let errorText = axiosError.response?.data;
        console.log(errorText);
        setError("" + errorText);
      }
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 gap-y-10">
      <div className="w-full">
        <div className="mt-10 w-full text-center text-5xl font-bold text-gray-900">
          Welcome to HealthAid
        </div>
      </div>
      <div className="bg-white px-10 pb-5 rounded-2xl">
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <Input
                  isRequired
                  type="text"
                  label="First Name"
                  defaultValue=""
                  isInvalid={isFirstNameValid}
                  color={isFirstNameValid ? "default" : "danger"}
                  onChange={(e) => {
                    setSubmit(false);
                    setError("");
                    setFirstName(e.target.value);
                  }}
                />
              </div>
              <div>
                <Input
                  isRequired
                  type="text"
                  label="Last Name"
                  defaultValue=""
                  isInvalid={isLastNameValid}
                  color={isLastNameValid ? "default" : "danger"}
                  onChange={(e) => {
                    setSubmit(false);
                    setError("");
                    setLastName(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="col-span-2">
              <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                <Input
                  isRequired
                  type="email"
                  label="Email"
                  defaultValue=""
                  isInvalid={!isEmailValid}
                  errorMessage={
                    (!isEmailValid && "Please enter a valid email") ||
                    (error != "" && error)
                  }
                  color={isEmailValid ? "default" : "danger"}
                  onChange={(e) => {
                    setSubmit(false);
                    setError("");
                    setEmail(e.target.value);
                  }}
                  onFocusChange={(focus) => {
                    if (!focus) {
                      console.log("Lost focus");
                      setIsEmailValid(emailCheck());
                    }
                  }}
                />
              </div>
            </div>
            <div className="col-span-2">
              <Input
                isRequired
                type="password"
                label="Password"
                defaultValue=""
                errorMessage={
                  !isConfirmPasswordValid && "Passwords do not match"
                }
                isInvalid={isPasswordValid}
                color={isPasswordValid ? "default" : "danger"}
                onChange={(e) => {
                  setSubmit(false);
                  setError("");
                  setPassword(e.target.value);
                }}
              />
            </div>
            <div className="col-span-2">
              <Input
                isRequired
                type="password"
                label="Confirm Password"
                defaultValue=""
                errorMessage={
                  !isConfirmPasswordValid && "Passwords do not match"
                }
                isInvalid={isConfirmPasswordValid}
                color={isConfirmPasswordValid ? "default" : "danger"}
                onChange={(e) => {
                  setSubmit(false);
                  setError("");
                  setConfirmPassword(e.target.value);
                }}
              />
            </div>
            <CheckboxGroup
              label="What role fits you best:"
              orientation="horizontal"
              color="secondary"
              value={role}
              defaultValue={["patient"]}
              onValueChange={(value) => {
                console.log(value);
                let last = value[value.length - 1];
                value = [last];
                setRole([last]);
              }}
            >
              <Checkbox value="patient">Patient</Checkbox>
              <Checkbox value="doctor">Doctor</Checkbox>
            </CheckboxGroup>
            <div>
              <Button
                type="submit"
                onClick={async (e) => {
                  await handleGoToOnboard(e);
                }}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-2 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Register
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
