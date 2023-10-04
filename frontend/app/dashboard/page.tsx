"use client";
import { title } from "@/components/primitives";
import { useEffect, useState } from "react";
import { Patient, PatientDefault } from "@/types";

export default function DashboardPage() {
  const [user, setUser] = useState<Patient>(PatientDefault);

  function getUserObject() {
    let userObjectString = localStorage.getItem("user") ?? "";
    let userObject = JSON.parse(userObjectString);
    setUser(userObject);
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
