"use client";

import { useEffect } from "react";

interface ToastProps {
	message: string;
	onClose: () => void;
}

export default function Toast({ message, onClose }: ToastProps) {
	useEffect(() => {
		const timer = setTimeout(() => {
			onClose();
		}, 3000);

		return () => clearTimeout(timer);
	}, [onClose]);

	return (
		<div className="fixed bottom-8 right-8 bg-zinc-900 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-slide-in">
			<svg
				className="w-5 h-5 text-green-400"
				fill="none"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path d="M5 13l4 4L19 7"></path>
			</svg>
			<span className="text-sm font-medium">{message}</span>
		</div>
	);
}
