"use client";
import { Button } from "@nextui-org/button";
import { Kbd } from "@nextui-org/kbd";
import { Link } from "@nextui-org/link";
import { Input } from "@nextui-org/input";

import { link as linkStyles } from "@nextui-org/theme";

import { siteConfig } from "@/config/site";
import NextLink from "next/link";
import clsx from "clsx";

import {
  TwitterIcon,
  GithubIcon,
  DiscordIcon,
  HeartFilledIcon,
  SearchIcon,
} from "@/components/icons";

import { Logo } from "@/components/icons";
import { useEffect, useState } from "react";
import { Patient, User } from "@/types";

export const Navbar = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  function addUserNameToNavBar(user: User) {
    let firstName = user.firstName;
    let lastName = user.lastName;
    setFirstName(firstName);
    setLastName(lastName);
    let index = siteConfig.navItems.find((value) => {
      return value.href == "/doctor/profile";
    });
    if (index == undefined) {
      siteConfig.navItems.push(
        {
          label: "Calendar",
          href: "/doctor/calendar",
        },
        {
          label: "|",
          href: "",
        },
        {
          label: `Dr. ${firstName} ${lastName}`,
          href: "/doctor/profile",
        }
      );
    }
  }

  useEffect(() => {
    let userObjectString = localStorage.getItem("user") ?? "";
    if (userObjectString != "") {
      let userObject = JSON.parse(userObjectString);
      addUserNameToNavBar(userObject);
    } else {
      window.location.href = "/";
    }
  }, []);
  return (
    <ul className="lg:flex gap-4 ml-auto px-5">
      {siteConfig.navItems.map((item) => (
        <div key={item.href}>
          <NextLink
            className={clsx(
              linkStyles({ color: "foreground", size: "lg" }),
              "data-[active=true]:text-primary data-[active=true]:font-medium"
            )}
            color="foreground"
            href={item.href}
          >
            {item.label}
          </NextLink>
        </div>
      ))}
    </ul>
  );
};
