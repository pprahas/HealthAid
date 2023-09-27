import "@/styles/globals.css";
import { Providers } from "./providers";

export default function RootLayout({children}: { children: React.ReactNode }) {
	return (
		<Providers>
			<div className="healthaid font-outfit min-h-screen flex flex-col">
				<header
					className="bg-background last:sticky top-0 h-14"
				>
					<aside className="bg-background w-full md:w-60 top-0 h-14 flex justify-center items-center">
					
						<h1 className="text-3xl font-bold">HealthAid</h1>
						
					</aside>
				</header>
				<div className="flex flex-col md:flex-row flex-1">
					<aside className="bg-background w-full md:w-60">
					
					Sidebar entries here
				
					</aside>
					<main className="flex-1">
						<div>
							
						</div>
						{children}
					</main>
				</div>
			</div>
			
		</Providers>
	);
  }