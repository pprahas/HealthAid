import {Table, TableHeader, TableBody, TableColumn, TableRow, TableCell} from "@nextui-org/table";
import {CircularProgress} from "@nextui-org/progress";
import {Input} from "@nextui-org/input";
import SearchIcon from "./searchIcon";
import { SetStateAction, useContext, useEffect, useState } from "react";

import { Doctor, Patient } from "@/types";
import axios, { AxiosError } from "axios";
import { Button } from "@nextui-org/button";
import { PatientContext } from "@/app/(main)/layout";


export function DoctorSearch() {
    const [searchQuery, setSearchQuery] = useState("")
    const emptyList = [] as Doctor[]

    const [doctors, setDoctors] = useState(emptyList)
    const [allDoctors, setAllDoctors] = useState(emptyList)
    const [loaded, setLoaded] = useState(false)

    const [patient, setPatient] = useContext(PatientContext) as [
        Patient,
        React.Dispatch<React.SetStateAction<Patient>>
      ];

    function filterList() {
        if (searchQuery !== "") {
            const filteredList = allDoctors.filter((item) => {
                const name = item.firstName + " " + item.lastName
                if (name.toLowerCase().includes(searchQuery.toLowerCase())) {
                    return item
                }
            })
            setDoctors(filteredList)
        } else {
            setDoctors(allDoctors)
        }
    }

    const filterByInsurance = async(doctorList : Doctor[]) => {
        let newDoctorList = [] as Doctor[]
        
        for (let i = 0; i < doctorList.length; i++) {
            if (doctorList[i].clinic != undefined) {
                let insurance = await doctorInsurance(doctorList[i].clinic as string)
                if (insurance === undefined) continue;
                if (insurance.localeCompare(patient.insurance) == 0) {
                    newDoctorList.push(doctorList[i])
                }
            }
        }
        
        setAllDoctors(newDoctorList);
        setDoctors(newDoctorList)
        setLoaded(true)
    }

    const doctorInsurance = async(id : string) => {
        try {
            const response = await axios.post("http://localhost:8080/getClinic", {
              clinicId: id,
            });
      
            const data = await response.data;
            return data.clinic.network;
          } catch (error) {
            console.error("Error:", error);
          }
    }

    const getDoctors = async() => {
        try {
            const response = await axios.post(
              "http://localhost:8080/getDoctorFromId/all",
              {
              }
            );
      
            const data = await response.data;
 
            filterByInsurance(data);

          } catch (error) {
            console.error("Error:", error);
          }
    }

    useEffect(() => {
        getDoctors()
    }, [])

    if (!loaded) {
        return (
            <div className="flex h-full place-content-center">
                    <CircularProgress label="Loading..." />
            </div>
        )
    } else {
        return(
            <div className="space-y-4">
                <div className="flex">
                    <Input 
                        isClearable
                        size="lg" variant="bordered"
                        startContent={<div className="object-contain py-3 opacity-50"><SearchIcon/></div>}
                        placeholder="Search for a Doctor..."
                        value={searchQuery}
                        onValueChange={setSearchQuery}
                        onClear={() => {
                            setDoctors(allDoctors)
                            setSearchQuery("")
                        }}
                        onKeyDown={(e) => {
                            if (e.keyCode == 13) {
                                filterList()
                            }
                        }}
                    />
                    <Button className="h-12 shadow-sm rounded-xl ml-4" variant="faded">
                        <div
                            onClick={() => {
                            filterList();
                            }}
                        >
                            Search
                        </div>
                    </Button>
                </div>
                <Table isStriped removeWrapper>
                    <TableHeader>
                        <TableColumn>First</TableColumn>
                        <TableColumn>Last</TableColumn>
                        <TableColumn>Email</TableColumn>
                    </TableHeader>
                    <TableBody 
                        emptyContent={"No results found"}
                        items={doctors}
                    >
                        {(item) => (
                            <TableRow key={item._id}>
                                <TableCell>{item.firstName}</TableCell>
                                <TableCell>{item.lastName}</TableCell>
                                <TableCell>{item.email}</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        )
    }
}