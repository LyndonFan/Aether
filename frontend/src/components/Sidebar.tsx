import React from "react";

interface SidebarProps {
	createNewNotes: (
		initialNoteContents: (string | null)[]
	) => void;
}

export default function Sidebar({
	createNewNotes,
}: SidebarProps): React.JSX.Element {
	const BUTTON_STYLING_CLASS_NAME =
		"bg-blue-500 text-white w-full py-2 rounded";

	const newNoteFromClipboard = () => {
		navigator.clipboard
			.readText()
			.then((content) => createNewNotes([content]));
	};

	const onReceiveFileInput = (event: EventTarget) => {
		console.log(event);
	};

	// input.addEventListener("change", (e) => {
	// 	const files = Array.from(e.target.files || []);
	// 	files.forEach((file) => {
	// 		const reader = new FileReader();
	// 		reader.onload = (e) => {
	// 			const content = e.target?.result as string;
	// 			const title = file.name.replace(
	// 				/\.md$/i,
	// 				""
	// 			);
	// 			fetch("/api/notes", {
	// 				method: "POST",
	// 				headers: {
	// 					"Content-Type": "application/json",
	// 				},
	// 				body: JSON.stringify({
	// 					title,
	// 					content,
	// 				}),
	// 			});
	// 		};
	// 		reader.readAsText(file);
	// 	});
	// });
	return (
		<div className="max-w-1/5 h-screen bg-gray-200 p-4 space-y-4">
			<button
				onClick={() => createNewNotes([null])}
				className={BUTTON_STYLING_CLASS_NAME}
			>
				New Blank Note
			</button>
			<button
				onClick={newNoteFromClipboard}
				className={BUTTON_STYLING_CLASS_NAME}
			>
				Import from Clipboard
			</button>
			<button className={BUTTON_STYLING_CLASS_NAME}>
				Import Notes from Files
				<input type="file" accept=".md,.txt" multiple />
			</button>
		</div>
	);
}
