"use client";
import { Button } from "@nextui-org/button";
import { Kbd } from "@nextui-org/kbd";
import { Link } from "@nextui-org/link";
import { Input } from "@nextui-org/input";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure} from "@nextui-org/modal";
import SearchIcon from "./searchIcon";
import { DoctorSearch } from "./doctorSearch";

import { link as linkStyles } from "@nextui-org/theme";

import { siteConfig } from "@/config/site";
import NextLink from "next/link";
import clsx from "clsx";

import {
  TwitterIcon,
  GithubIcon,
  DiscordIcon,
  HeartFilledIcon,
} from "@/components/icons";

import { Logo } from "@/components/icons";
import { useEffect, useState } from "react";
import { Patient, User } from "@/types";

export const Navbar = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  function addUserNameToNavBar(user: User) {
    let firstName = user.firstName;
    let lastName = user.lastName;
    setFirstName(firstName);
    setLastName(lastName);
    let index = siteConfig.navItems.find((value) => {
      return value.href == "/profile";
    });
    if (index == undefined) {
      siteConfig.navItems.push(
        {
          label: "|",
          href: "",
        },
        {
          label: "Calendar",
          href: "/calendar",
        },
        {
          label: "|",
          href: "",
        },
        {
          label: `${firstName} ${lastName}`,
          href: "/profile",
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
    <ul className="lg:flex gap-4 ml-auto px-5 items-center">
      <Button onPress={onOpen} startContent={<SearchIcon/>} radius="lg" className="text-lg bg-secondary-100">
        Find a doctor
      </Button>

      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
        size="5xl"
        className="healthaid bg-white text-black rounded-3xl font-outfit h-[calc(95%)]"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className="py-10 px-5">
                <DoctorSearch/>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      
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
