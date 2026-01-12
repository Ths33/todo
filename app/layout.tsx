import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
	title: "Daily Updates",
	description: "Daily task lists and todo management",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className="bg-zinc-50 min-h-screen">
				<div className="py-8 px-4">
					<div className="max-w-7xl mx-auto">
						<Navigation />
						{children}
					</div>
				</div>
			</body>
		</html>
	);
}
