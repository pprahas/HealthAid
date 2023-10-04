import "@/styles/globals.css";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Providers } from "../providers";
import { Navbar } from "@/components/navbar";
import { Link } from "@nextui-org/link";
import clsx from "clsx";
import { Sidebar } from "../../components/sidebar"
import { Patients } from "./home/testList";

export const metadata: Metadata = {
	title: {
		default: siteConfig.name,
		template: `%s - ${siteConfig.name}`,
	},
	description: siteConfig.description,
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "white" },
		{ media: "(prefers-color-scheme: dark)", color: "black" },
	],
	icons: {
		icon: "/favicon.ico",
		shortcut: "/favicon-16x16.png",
		apple: "/apple-touch-icon.png",
	},
};

export default function Layout({children}: { children: React.ReactNode }) {

	return (
		
		<div className="healthaid font-outfit min-h-screen flex flex-col bg-background">
			<header className="last:sticky flex top-0 h-15 items-center">
				<aside className="w-full md:w-60 top-0 h-14 flex justify-center items-center">
					<div className="text-3xl font-bold">HealthAid</div>
				</aside>
				<Navbar/>
			</header>
			
			<div className="flex flex-col md:flex-row flex-1">
				<aside className="w-full md:w-60 pr-2 h-[calc(100vh-56px)]">
					<Sidebar patients={Patients}/>
				</aside>
				<div className="flex-1 bg-white rounded-tl-3xl">
					{children}
				</div>
			</div>
		</div>
	);
}