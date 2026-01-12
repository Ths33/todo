"use client";

import { useState, useEffect } from "react";
import Toast from "@/components/Toast";
import ConfirmDialog from "@/components/ConfirmDialog";

interface DailyUpdate {
	introText: string;
	date: string;
	tasks: string[];
	timestamp: number;
}

export default function Home() {
	const [introText, setIntroText] = useState("Good Morning!");
	const [date, setDate] = useState("");
	const [tasks, setTasks] = useState<string[]>([""]);
	const [preview, setPreview] = useState("");
	const [history, setHistory] = useState<
		Array<{ key: string } & DailyUpdate>
	>([]);
	const [toast, setToast] = useState<string | null>(null);
	const [confirmDialog, setConfirmDialog] = useState<{
		message: string;
		onConfirm: () => void;
	} | null>(null);

	useEffect(() => {
		const today = new Date().toISOString().split("T")[0];
		setDate(today);
		loadData(today);
		loadHistory();
	}, []);

	useEffect(() => {
		generatePreview();
	}, [introText, date, tasks]);

	const loadData = (selectedDate: string) => {
		const key = `dailyUpdate_${selectedDate}`;
		const stored = localStorage.getItem(key);

		if (stored) {
			const data: DailyUpdate = JSON.parse(stored);
			setIntroText(data.introText || "Good Morning!");
			setTasks(data.tasks.length > 0 ? data.tasks : [""]);
		} else {
			setIntroText("Good Morning!");
			setTasks([""]);
		}
	};

	const loadHistory = () => {
		const savedItems: Array<{ key: string } & DailyUpdate> = [];
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key && key.startsWith("dailyUpdate_")) {
				const data = JSON.parse(localStorage.getItem(key)!);
				savedItems.push({ key, ...data });
			}
		}
		savedItems.sort(
			(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
		);
		setHistory(savedItems);
	};

	const formatDate = (dateString: string) => {
		const d = new Date(dateString + "T00:00:00");
		return d.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const generateText = () => {
		const formattedDate = formatDate(date);
		let output = `<p>${introText}</p>`;
		output += `<p>Date: ${formattedDate}</p>`;
		output += `<p>Priorities for Today:</p>`;
		output += `<ul>`;

		tasks.forEach((task) => {
			if (task.trim()) {
				output += `<li>${task}</li>`;
			}
		});

		output += `</ul>`;
		return output;
	};

	const generatePreview = () => {
		const html = generateText();
		setPreview(html);
	};

	const addTask = () => {
		setTasks([...tasks, ""]);
	};

	const removeTask = (index: number) => {
		setTasks(tasks.filter((_, i) => i !== index));
	};

	const updateTask = (index: number, value: string) => {
		const newTasks = [...tasks];
		newTasks[index] = value;
		setTasks(newTasks);
	};

	const saveData = () => {
		const validTasks = tasks.filter((t) => t.trim());
		const data: DailyUpdate = {
			introText,
			date,
			tasks: validTasks,
			timestamp: Date.now(),
		};

		const key = `dailyUpdate_${date}`;
		localStorage.setItem(key, JSON.stringify(data));
		loadHistory();
		setToast("Saved successfully!");
	};

	const copyToClipboard = async () => {
		const html = generateText();
		try {
			await navigator.clipboard.write([
				new ClipboardItem({
					"text/html": new Blob([html], { type: "text/html" }),
					"text/plain": new Blob([html], { type: "text/plain" }),
				}),
			]);
			setToast("Copied to clipboard!");
		} catch (err) {
			console.error("Copy failed:", err);
		}
	};

	const copyHistoryItem = async (key: string) => {
		const stored = localStorage.getItem(key);
		if (!stored) return;

		const data: DailyUpdate = JSON.parse(stored);
		const formattedDate = formatDate(data.date);

		let html = `<p>${data.introText}</p>`;
		html += `<p>Date: ${formattedDate}</p>`;
		html += `<p>Priorities for Today:</p>`;
		html += `<ul>`;
		data.tasks.forEach((task) => {
			html += `<li>${task}</li>`;
		});
		html += `</ul>`;

		try {
			await navigator.clipboard.write([
				new ClipboardItem({
					"text/html": new Blob([html], { type: "text/html" }),
					"text/plain": new Blob([html], { type: "text/plain" }),
				}),
			]);
			setToast("Copied to clipboard!");
		} catch (err) {
			console.error("Copy failed:", err);
		}
	};

	const deleteHistoryItem = (key: string) => {
		setConfirmDialog({
			message: "Are you sure you want to delete this update?",
			onConfirm: () => {
				localStorage.removeItem(key);
				loadHistory();
				setToast("Update deleted successfully");
				setConfirmDialog(null);
			},
		});
	};

	return (
		<>
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-zinc-900 mb-1">
					Daily Updates
				</h1>
				<p className="text-zinc-600 text-sm">
					Create and manage your daily task lists
				</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
				{/* Form Section */}
				<div className="bg-white border border-zinc-200 rounded-lg p-6">
					<div className="mb-4">
						<label className="block text-sm font-medium text-zinc-900 mb-2">
							Intro Text
						</label>
						<input
							type="text"
							value={introText}
							onChange={(e) => setIntroText(e.target.value)}
							className="w-full px-3 py-2 rounded-md border border-zinc-200 text-sm focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all"
							placeholder="Good Morning!"
						/>
					</div>

					<div className="mb-4">
						<label className="block text-sm font-medium text-zinc-900 mb-2">
							Date
						</label>
						<input
							type="date"
							value={date}
							onChange={(e) => {
								setDate(e.target.value);
								loadData(e.target.value);
							}}
							className="w-full px-3 py-2 rounded-md border border-zinc-200 text-sm focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all"
						/>
					</div>

					<div className="mb-4">
						<label className="block text-sm font-medium text-zinc-900 mb-2">
							Priorities for Today
						</label>
						<div className="space-y-2 mb-3">
							{tasks.map((task, index) => (
								<div
									key={index}
									className="flex gap-2 items-start"
								>
									<input
										type="text"
										value={task}
										onChange={(e) =>
											updateTask(index, e.target.value)
										}
										className="flex-1 px-3 py-2 rounded-md border border-zinc-200 text-sm focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all"
										placeholder="Task..."
									/>
									<button
										onClick={() => removeTask(index)}
										className="px-3 py-2 bg-red-50 text-red-600 border border-red-200 rounded-md text-sm font-medium hover:bg-red-100 transition-colors"
										title="Remove"
									>
										<svg
											className="w-4 h-4"
											fill="none"
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
										</svg>
									</button>
								</div>
							))}
						</div>
						<button
							onClick={addTask}
							className="w-full px-4 py-2 bg-zinc-100 text-zinc-900 border border-zinc-200 rounded-md text-sm font-medium hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
						>
							<svg
								className="w-4 h-4"
								fill="none"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path d="M12 4v16m8-8H4"></path>
							</svg>
							Add Task
						</button>
					</div>
				</div>

				{/* Preview Section */}
				<div className="bg-white border border-zinc-200 rounded-lg p-6">
					<div className="lg:sticky lg:top-6">
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-lg font-semibold text-zinc-900">
								Preview
							</h2>
							<button
								onClick={copyToClipboard}
								className="px-3 py-2 bg-zinc-100 text-zinc-900 border border-zinc-200 rounded-md text-sm font-medium hover:bg-zinc-200 transition-colors flex items-center gap-2"
							>
								<svg
									className="w-4 h-4"
									fill="none"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
								</svg>
								Copy
							</button>
						</div>
						<div
							className="bg-zinc-50 p-4 rounded-md text-sm text-zinc-700 leading-relaxed min-h-[200px] mb-4"
							dangerouslySetInnerHTML={{ __html: preview }}
						/>
						<button
							onClick={saveData}
							className="w-full px-4 py-2 bg-zinc-900 text-white rounded-md text-sm font-medium hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
						>
							<svg
								className="w-4 h-4"
								fill="none"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
							</svg>
							Save Task
						</button>
					</div>
				</div>
			</div>

			{/* History */}
			<div className="mt-8">
				<h2 className="text-lg font-semibold text-zinc-900 mb-4">
					Saved Updates
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{history.length === 0 ? (
						<div className="col-span-full text-center text-zinc-400 py-8">
							<svg
								className="w-12 h-12 mx-auto mb-2 text-zinc-300"
								fill="none"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
							</svg>
							<p className="text-sm">No saved updates yet</p>
						</div>
					) : (
						history.map((item) => (
							<div
								key={item.key}
								className="bg-white border border-zinc-200 rounded-lg p-4 hover:border-zinc-400 hover:shadow-md transition-all"
							>
								<div className="flex justify-between items-start mb-3">
									<div className="flex-1">
										<h3 className="text-sm font-semibold text-zinc-900 mb-1">
											{formatDate(item.date)}
										</h3>
										<p className="text-xs text-zinc-500">
											{item.introText}
										</p>
									</div>
									<div className="flex gap-2">
										<button
											onClick={() =>
												copyHistoryItem(item.key)
											}
											className="px-3 py-1.5 bg-zinc-100 text-zinc-900 border border-zinc-200 rounded-md text-xs font-medium hover:bg-zinc-200 transition-colors"
											title="Copy to clipboard"
										>
											<svg
												className="w-3.5 h-3.5"
												fill="none"
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
											</svg>
										</button>
										<button
											onClick={() =>
												deleteHistoryItem(item.key)
											}
											className="px-2 text-zinc-400 hover:text-red-600 transition-colors"
											title="Delete"
										>
											<svg
												className="w-4 h-4"
												fill="none"
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
											</svg>
										</button>
									</div>
								</div>
								<div className="text-xs text-zinc-700">
									<div className="font-medium text-zinc-900 mb-2">
										Tasks:
									</div>
									<ul className="space-y-1.5">
										{item.tasks.map((task, idx) => (
											<li
												key={idx}
												className="flex items-start gap-2"
											>
												<span className="text-zinc-400 mt-0.5">
													•
												</span>
												<span className="flex-1">
													{task}
												</span>
											</li>
										))}
									</ul>
								</div>
							</div>
						))
					)}
				</div>
			</div>

			{toast && <Toast message={toast} onClose={() => setToast(null)} />}
			{confirmDialog && (
				<ConfirmDialog
					message={confirmDialog.message}
					onConfirm={confirmDialog.onConfirm}
					onCancel={() => setConfirmDialog(null)}
				/>
			)}
		</>
	);
}
