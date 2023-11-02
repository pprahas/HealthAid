"use client";
import { title } from "@/components/primitives";
import { useEffect, useState } from "react";
import { Patient, PatientDefault } from "@/types";

export default function AdminHomePage() {
  const [user, setUser] = useState<Patient>(PatientDefault);

  function getUserObject() {
    let userObjectString = localStorage.getItem("user") ?? "";
    let userObject = JSON.parse(userObjectString);
    setUser(userObject);

    // Redirect to /home if the user's email is not 'admin@healthaid.com'
    if (userObject.email !== "admin@healthaid.com") {
      window.location.href = "/home";
    }
  }

  useEffect(() => {
    getUserObject();
  }, []);

  return (
    <div>
      <h1 className={title()}>
        Welcome - {user.firstName} {user.lastName}
      </h1>
    </div>
  );
}
