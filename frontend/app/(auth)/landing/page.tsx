"use client";
import { title } from "@/components/primitives";
import { useState } from "react";
import { Button } from "@nextui-org/button";

const handleJoin = () => {
  window.location.href = "/register";
};

export default function LandingPage() {
  return (
    <section className="flex flex-col items-center justify-center gap-8 py-12 bg-gradient-to-b from-blue-200 to-white rounded-t-xl rounded-b-xl">
      <div className="text-center max-w-3xl">
        <h1 className="text-5xl font-bold mb-4 text-gray-800">Welcome to HealthAid</h1>
        <p className="text-lg text-gray-600">
          Empowering Your Health Journey with Telehealth and AI.
        </p>
      </div>

      <div className="mt-4 text-center text-gray-700 max-w-3xl px-4">
        <p className="mb-6">
          At HealthAid, we are committed to revolutionizing healthcare accessibility. Our telehealth app connects users with skilled doctors and leverages AI to provide personalized health advice and streamline appointment scheduling.
        </p>
        <p>
          Unlike other telehealth solutions, HealthAid's AI features assess user symptoms, offer initial health guidance, and provide real-time support for common medical questions. Make informed decisions about your health before connecting with a doctor.
        </p>
      </div>

      <div className="mb-8">
        <Button
          color="success"
          className="w-full text-white p-3 bg-blue-500 hover:bg-blue-600 focus:outline-none rounded-md"
          onClick={handleJoin}
        >
          Join HealthAid
        </Button>
      </div>

      <div className="text-center text-gray-600">
        <p>
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Login here
          </a>
          .
        </p>
      </div>
    </section>
  );
}
