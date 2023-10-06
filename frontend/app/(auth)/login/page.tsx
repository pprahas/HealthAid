"use client";
import { title } from "@/components/primitives";
import { useState } from "react";

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
        // loginData.patient.type = "patient";
        localStorage.setItem("user", JSON.stringify(loginData.user));
        window.location.href = "/home";
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
          className="border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="mb-1">
        <button
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mr-4"
          onClick={handleLogin}
        >
          Login
        </button>
        <button
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          onClick={handleRegister}
        >
          Register
        </button>
      </div>
      <div className="mb-0">
        <a href="/reset_password">Reset Password</a>
      </div>
      {error && <div className="text-red-600">{error}</div>}
    </section>
  );
}
