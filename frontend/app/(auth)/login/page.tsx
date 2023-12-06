"use client";
import { title } from "@/components/primitives";
import { useState } from "react";
import { Button } from "@nextui-org/button";
import { Console } from "console";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const requestBody = {
        email: email,
        password: password,
      };

      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody), // Send email and password as JSON
        mode: "cors", // Enable CORS
      });

      if (response.ok) {
        let loginData = await response.json();
        let user = loginData.user;
        localStorage.setItem("user", JSON.stringify(user));
        console.log("EMAIL  " + email)
        if(email === "admin@healthaid.com"){
          window.location.href = "/adminHome";
        } else if (user.userType === "doctor") {
          window.location.href = "/doctor/home";
        } else {
          window.location.href = "/home";
        }
      } else {
        const data = await response.json();
        setError("Invalid email or password. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred while logging in.");
    }
  };

  const handleRegister = () => {
    window.location.href = "/register";
  };

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Login</h1>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Email"
          className="p-4 shadow-sm rounded-xl bg-gray-100 hover:bg-gray-200 transition duration-200"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <input
          type="password"
          placeholder="Password"
          className="p-4 shadow-sm rounded-xl bg-gray-100 hover:bg-gray-200 transition duration-200"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="mb-1">
        <Button
          color="success"
          className="text-white p-2 hover:bg-secondary-800 mr-4"
          onClick={handleLogin}
        >
          Login
        </Button>
        <Button
          className="bg-blue-500 text-white hover:bg-blue-600"
          onClick={handleRegister}
        >
          Register
        </Button>
      </div>
      <div className="mb-0">
        <a href="/reset_password">Reset Password</a>
      </div>
      {error && <div className="text-red-600">{error}</div>}
    </section>
  );
}
