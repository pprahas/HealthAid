"use client";

import React, { useState, MouseEvent, FormEvent } from "react";
import axios, { AxiosError } from "axios";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Checkbox, CheckboxGroup } from "@nextui-org/react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isOldPasswordValid, setIsOldPasswordValid] = useState(true);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submit, setSubmit] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState([""]);

  function emailCheck() {
    if (email === "") return !submit;

    return (
      email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/i) != null
    );
  }

  const isNewPasswordValid = React.useMemo(() => {
    if (newPassword === "") return !submit;

    return newPassword.match(/^[\x20-\x7E]+$/) != null;
  }, [newPassword, submit]);

  const isConfirmPasswordValid = React.useMemo(() => {
    if (confirmPassword === "" || confirmPassword != newPassword)
      return !submit;

    return newPassword.match(/^[\x20-\x7E]+$/) != null;
  }, [confirmPassword, submit]);

  const handleGoToLogin = async (e: MouseEvent<HTMLButtonElement>) => {
    try {
      const requestBody = {
        email: email,
        password: oldPassword,
      };

      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody), // Send email and password as JSON
        mode: "cors", // Enable CORS
      });

      if (!response.ok) {
        setIsOldPasswordValid(false);
        setError("Invalid email or password. Please try again.");
        return;
      } else {
        setIsOldPasswordValid(true);
      }
    } catch (error) {
      console.error("Error:", error);
    }

    if (
      isEmailValid &&
      isNewPasswordValid &&
      isConfirmPasswordValid &&
      isOldPasswordValid
    ) {
      e.preventDefault();
      try {
        setSubmit(true);
        const requestBody = {
          email: email,
          password: oldPassword,
          newPassword: newPassword,
        };
        const response = await fetch("http://localhost:8080/resetPassword", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody), // Send email and password as JSON
          mode: "cors", // Enable CORS
        });

        if (response.ok) {
          window.location.href = "/login";
        } else {
          setError("Could not reset password");
        }
      } catch (error) {
        const axiosError = error as AxiosError;
        let errorText = axiosError.response?.data;
        setError("" + errorText);
      }
    }
    setSubmit(false);
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 gap-y-10">
      <div className="w-full">
        <div className="mt-10 w-full text-center text-5xl font-bold text-gray-900">
          Reset Password
        </div>
      </div>
      <div className="bg-white px-10 pb-5 rounded-2xl">
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {/* <form className="space-y-6"> */}
          <div className="space-y-6">
            <div className="col-span-2">
              <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                <Input
                  isRequired
                  type="email"
                  label="Email"
                  value={email}
                  isInvalid={!isEmailValid}
                  errorMessage={!isEmailValid && "Please enter a valid email"}
                  color={isEmailValid ? "default" : "danger"}
                  onChange={(e) => {
                    setSubmit(false);
                    setError("");
                    setEmail(e.target.value);
                  }}
                  onFocusChange={(focus) => {
                    if (!focus) {
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
                label="Old Password"
                value={oldPassword}
                isInvalid={isOldPasswordValid}
                errorMessage={error != "" && error}
                color={isOldPasswordValid ? "default" : "danger"}
                onChange={(e) => {
                  setSubmit(false);
                  setError("");
                  setOldPassword(e.target.value);
                  setIsOldPasswordValid(true);
                }}
              />
            </div>
            <div className="col-span-2">
              <Input
                isRequired
                type="password"
                label="New Password"
                defaultValue=""
                errorMessage={
                  !isConfirmPasswordValid && "Passwords do not match"
                }
                isInvalid={isNewPasswordValid}
                color={isNewPasswordValid ? "default" : "danger"}
                onChange={(e) => {
                  setSubmit(false);
                  setError("");
                  setNewPassword(e.target.value);
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

            <div>
              <Button
                type="submit"
                onClick={async (e) => {
                  await handleGoToLogin(e);
                }}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-2 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Submit
              </Button>
            </div>
            {/* </form> */}
          </div>
        </div>
      </div>
    </div>
  );
}
