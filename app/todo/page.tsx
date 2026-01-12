"use client";

import { useState, useEffect } from "react";
import Toast from "@/components/Toast";
import ConfirmDialog from "@/components/ConfirmDialog";

interface Todo {
	id: number;
	text: string;
	done: boolean;
	registeredDate: string;
	registeredTimestamp: number;
	completedDate: string | null;
	completedTimestamp: number | null;
}

export default function TodoPage() {
	const [taskInput, setTaskInput] = useState("");
	const [taskDate, setTaskDate] = useState("");
	const [todos, setTodos] = useState<Todo[]>([]);
	const [toast, setToast] = useState<string | null>(null);
	const [confirmDialog, setConfirmDialog] = useState<{
		message: string;
		onConfirm: () => void;
	} | null>(null);

	useEffect(() => {
		const today = new Date().toISOString().split("T")[0];
		setTaskDate(today);
		loadTodos();
	}, []);

	const loadTodos = () => {
		const stored = localStorage.getItem("todos");
		if (stored) {
			setTodos(JSON.parse(stored));
		}
	};

	const saveTodos = (newTodos: Todo[]) => {
		localStorage.setItem("todos", JSON.stringify(newTodos));
		setTodos(newTodos);
	};

	const addTodo = () => {
		if (!taskInput.trim()) {
			setToast("Please enter a task");
			return;
		}

		if (!taskDate) {
			setToast("Please select a date");
			return;
		}

		const now = Date.now();
		const newTodo: Todo = {
			id: now,
			text: taskInput.trim(),
			done: false,
			registeredDate: taskDate,
			registeredTimestamp: now,
			completedDate: null,
			completedTimestamp: null,
		};

		saveTodos([...todos, newTodo]);
		setTaskInput("");
		setToast("Task added successfully");
	};

	const toggleTodo = (id: number) => {
		const now = Date.now();
		const newTodos = todos.map((todo) => {
			if (todo.id === id) {
				return {
					...todo,
					done: !todo.done,
					completedDate: !todo.done
						? new Date().toISOString().split("T")[0]
						: null,
					completedTimestamp: !todo.done ? now : null,
				};
			}
			return todo;
		});
		saveTodos(newTodos);
	};

	const deleteTodo = (id: number) => {
		setConfirmDialog({
			message: "Are you sure you want to delete this task?",
			onConfirm: () => {
				const newTodos = todos.filter((t) => t.id !== id);
				saveTodos(newTodos);
				setToast("Task deleted successfully");
				setConfirmDialog(null);
			},
		});
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString + "T00:00:00");
		return date.toLocaleDateString("en-US", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
		});
	};

	const formatDateTime = (timestamp: number) => {
		const date = new Date(timestamp);
		return date.toLocaleString("en-US", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		});
	};

	const activeTodos = todos.filter((t) => !t.done);
	const doneTodos = todos.filter((t) => t.done);

	// Group todos by registration date
	const groupedByDate: { [key: string]: Todo[] } = {};
	todos.forEach((todo) => {
		if (!groupedByDate[todo.registeredDate]) {
			groupedByDate[todo.registeredDate] = [];
		}
		groupedByDate[todo.registeredDate].push(todo);
	});

	const sortedDates = Object.keys(groupedByDate).sort(
		(a, b) => new Date(b).getTime() - new Date(a).getTime()
	);

	return (
		<>
			<div className="mb-6">
				<h1 className="text-3xl font-bold text-zinc-900 mb-2">
					To Do List
				</h1>
				<p className="text-sm text-zinc-600">
					Organize your tasks and mark them as complete
				</p>
			</div>

			{/* Two Column Layout: Form and Active Tasks */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
				{/* Add Task Form */}
				<div className="bg-white border border-zinc-200 rounded-lg p-6">
					<h2 className="text-lg font-semibold text-zinc-900 mb-4">
						Add New Task
					</h2>
					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-zinc-700 mb-1">
								Task
							</label>
							<input
								type="text"
								value={taskInput}
								onChange={(e) => setTaskInput(e.target.value)}
								onKeyPress={(e) =>
									e.key === "Enter" && addTodo()
								}
								className="w-full bg-white border border-zinc-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all"
								placeholder="Enter task..."
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-zinc-700 mb-1">
								Registration Date
							</label>
							<input
								type="date"
								value={taskDate}
								onChange={(e) => setTaskDate(e.target.value)}
								className="w-full bg-white border border-zinc-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all"
							/>
						</div>
						<button
							onClick={addTodo}
							className="bg-zinc-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-zinc-800 transition-colors flex items-center gap-2"
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

				{/* Active Tasks */}
				<div className="bg-white border border-zinc-200 rounded-lg p-6">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-lg font-semibold text-zinc-900">
							Active Tasks
						</h2>
						<span className="text-sm text-zinc-600">
							{activeTodos.length}{" "}
							{activeTodos.length === 1 ? "task" : "tasks"}
						</span>
					</div>
					<div className="space-y-2">
						{activeTodos.length === 0 ? (
							<p className="text-sm text-zinc-500">
								No active tasks
							</p>
						) : (
							activeTodos.map((todo) => (
								<div
									key={todo.id}
									className="bg-white border border-zinc-200 rounded-md px-4 py-3 flex items-center gap-3 hover:bg-zinc-50 transition-colors"
								>
									<input
										type="checkbox"
										checked={todo.done}
										onChange={() => toggleTodo(todo.id)}
										className="w-5 h-5 border-2 border-zinc-200 rounded cursor-pointer accent-zinc-900"
									/>
									<div className="flex-1">
										<p className="text-sm text-zinc-900">
											{todo.text}
										</p>
										<p className="text-xs text-zinc-500">
											Registered on{" "}
											{formatDateTime(
												todo.registeredTimestamp
											)}
										</p>
									</div>
									<button
										onClick={() => deleteTodo(todo.id)}
										className="text-zinc-400 hover:text-red-600 transition-colors"
									>
										<svg
											className="w-5 h-5"
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
							))
						)}
					</div>
				</div>
			</div>

			{/* Completed Tasks */}
			<div className="bg-white border border-zinc-200 rounded-lg p-6 mb-6">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-lg font-semibold text-zinc-900">
						Completed Tasks
					</h2>
					<span className="text-sm text-zinc-600">
						{doneTodos.length}{" "}
						{doneTodos.length === 1 ? "task" : "tasks"}
					</span>
				</div>
				<div className="space-y-2">
					{doneTodos.length === 0 ? (
						<p className="text-sm text-zinc-500">
							No completed tasks
						</p>
					) : (
						doneTodos.map((todo) => (
							<div
								key={todo.id}
								className="bg-white border border-zinc-200 rounded-md px-4 py-3 flex items-center gap-3 opacity-60"
							>
								<input
									type="checkbox"
									checked={todo.done}
									onChange={() => toggleTodo(todo.id)}
									className="w-5 h-5 border-2 border-zinc-200 rounded cursor-pointer accent-zinc-900"
								/>
								<div className="flex-1">
									<p className="text-sm text-zinc-500 line-through">
										{todo.text}
									</p>
									<p className="text-xs text-zinc-500">
										Completed on{" "}
										{todo.completedTimestamp
											? formatDateTime(
													todo.completedTimestamp
											  )
											: "N/A"}
									</p>
								</div>
								<button
									onClick={() => deleteTodo(todo.id)}
									className="text-zinc-400 hover:text-red-600 transition-colors"
								>
									<svg
										className="w-5 h-5"
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
						))
					)}
				</div>
			</div>

			{/* History by Date */}
			<div className="mb-6">
				<h2 className="text-lg font-semibold text-zinc-900 mb-4">
					History by Date
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{sortedDates.length === 0 ? (
						<p className="text-sm text-zinc-500">
							No history available
						</p>
					) : (
						sortedDates.map((date) => {
							const dateTodos = groupedByDate[date];
							const doneCount = dateTodos.filter(
								(t) => t.done
							).length;
							const totalCount = dateTodos.length;

							return (
								<div
									key={date}
									className="bg-white border border-zinc-200 rounded-lg p-6 hover:shadow-md transition-all"
								>
									<div className="mb-3">
										<h3 className="font-semibold text-zinc-900">
											{formatDate(date)}
										</h3>
										<p className="text-xs text-zinc-500">
											{doneCount}/{totalCount} completed
										</p>
									</div>
									<div className="space-y-2">
										{dateTodos.map((todo) => (
											<div
												key={todo.id}
												className="flex items-start gap-2 text-sm"
											>
												<svg
													className={`w-4 h-4 mt-0.5 ${
														todo.done
															? "text-green-600"
															: "text-zinc-300"
													}`}
													fill="currentColor"
													viewBox="0 0 20 20"
												>
													<path
														fillRule="evenodd"
														d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
														clipRule="evenodd"
													/>
												</svg>
												<span
													className={
														todo.done
															? "text-zinc-500 line-through"
															: "text-zinc-700"
													}
												>
													{todo.text}
												</span>
											</div>
										))}
									</div>
								</div>
							);
						})
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
