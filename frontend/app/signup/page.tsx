"use client";

import React, { useState, MouseEvent, FormEvent } from "react";
import axios from "axios";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";

export default function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submit, setSubmit] = useState(false);

  const isEmailValid = React.useMemo(() => {
    if (email === "") return submit;

    return email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i) != null;
  }, [email, submit]);

  const isFirstNameValid = React.useMemo(() => {
    if (firstName === "") return !submit;

    return firstName.match(/^[A-Za-z\s'-]+$/i) != null;
  }, [firstName, submit]);

  const isLastNameValid = React.useMemo(() => {
    if (lastName === "") return !submit;

    return lastName.match(/^[A-Za-z\s'-]+$/i) != null;
  }, [lastName, submit]);

  const isPasswordValid = React.useMemo(() => {
    if (password === "") return !submit;

    return password.match(/^[A-Za-z\s'-]+$/i) != null;
  }, [password, submit]);

  const isConfirmPasswordValid = React.useMemo(() => {
    if (confirmPassword === "" || confirmPassword != password) return !submit;

    return password.match(/^[A-Za-z\s'-]+$/i) != null;
  }, [confirmPassword, submit]);

  const handleRegister = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      setSubmit(true);
      const response = await axios.post("http://localhost:8080/register", {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
      });

      console.log("Response:", response.data);
    } catch (error) {
      console.log("Error:", error);
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
                  isInvalid={isEmailValid}
                  errorMessage={isEmailValid && "Please enter a valid email"}
                  color={isEmailValid ? "danger" : "default"}
                  onChange={(e) => {
                    setSubmit(false);
                    setEmail(e.target.value);
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
                  setConfirmPassword(e.target.value);
                }}
              />
            </div>

            <div>
              <Button
                type="submit"
                onClick={async (e) => {
                  await handleRegister(e);
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
