import "@/styles/globals.css";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Providers } from "../providers";
import { Navbar } from "@/components/navbar";
import { Link } from "@nextui-org/link";
import clsx from "clsx";



export default function Layout({children}: { children: React.ReactNode }) {
	return (
		 <div className="flex h-screen healthaid font-outfit bg-background">
            <div className="m-auto py-10 px-20 rounded-xl bg-white shadow-2xl">
                {children}
            </div>
        </div>
	);
}