import { Patient } from "../app/(main)/home/testList";

interface props {
    patients: Patient[];
}

export const Sidebar = ({patients} : props) => {
    return (
       
        <div className="content-center space-y-4 text-lg h-[calc(100vh-56px)] overflow-auto snap-y">
            {patients?.map((patient: Patient, index: number) => (
                <div key={index} className="text-center snap-start">
                    <div>{patient.lastName}, {patient.firstName}</div>
                </div>
            ))}
            
        </div>
    );
};