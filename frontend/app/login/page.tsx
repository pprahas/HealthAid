import { title } from "@/components/primitives";

export default function LoginPage() {
	return (
		<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
			<div className="inline-block max-w-lg text-center justify-center">
				<h1 className="text-3xl font-bold mb-4">Login</h1>
			</div>

			<div className="mb-4">
				<input
					type="text"
					placeholder="Username"
					className="border p-2 rounded"
				/>
			</div>

			<div className="mb-4">
				<input
					type="password"
					placeholder="Password"
					className="border p-2 rounded"
				/>
			</div>

			<div className="mb-1">
				<button
					className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mr-4">
					Login
				</button>
				<button
					className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
					Register
				</button>
			</div>
			<div className="mb-4">
				<a href="/reset_password">Reset Password</a>
			</div>
		</section>
	);
}
