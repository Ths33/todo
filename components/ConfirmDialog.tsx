"use client";

interface ConfirmDialogProps {
	message: string;
	onConfirm: () => void;
	onCancel: () => void;
}

export default function ConfirmDialog({
	message,
	onConfirm,
	onCancel,
}: ConfirmDialogProps) {
	return (
		<>
			<div
				className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
				onClick={onCancel}
			/>
			<div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 z-50 min-w-[300px] animate-fade-in">
				<p className="font-medium text-zinc-900 mb-6">{message}</p>
				<div className="flex gap-2 justify-end">
					<button
						onClick={onCancel}
						className="px-4 py-2 bg-zinc-100 text-zinc-900 rounded-md text-sm font-medium hover:bg-zinc-200 transition-colors border border-zinc-200"
					>
						Cancel
					</button>
					<button
						onClick={onConfirm}
						className="px-4 py-2 bg-zinc-900 text-white rounded-md text-sm font-medium hover:bg-zinc-800 transition-colors"
					>
						Yes, Delete
					</button>
				</div>
			</div>
		</>
	);
}
