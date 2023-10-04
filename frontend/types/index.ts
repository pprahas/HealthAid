import {SVGProps} from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface Patient {
  firstName: string,
  lastName: string,
  email: string,
}

export const PatientDefault: Patient = {
  firstName: "",
  lastName: "",
  email: "",
}
