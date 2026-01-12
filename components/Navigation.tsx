"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
	const pathname = usePathname();

	return (
		<div className="mb-6 flex gap-6 border-b border-zinc-200">
			<Link
				href="/"
				className={`text-sm font-medium transition-colors pb-3 ${
					pathname === "/"
						? "text-zinc-900 border-b-2 border-zinc-900"
						: "text-zinc-500 hover:text-zinc-900"
				}`}
			>
				Daily Updates
			</Link>
			<Link
				href="/todo"
				className={`text-sm font-medium transition-colors pb-3 ${
					pathname === "/todo"
						? "text-zinc-900 border-b-2 border-zinc-900"
						: "text-zinc-500 hover:text-zinc-900"
				}`}
			>
				To Do List
			</Link>
		</div>
	);
}
