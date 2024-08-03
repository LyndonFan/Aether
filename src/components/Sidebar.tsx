import React from "react";

interface SidebarProps {
	createNewNote: () => void;
}

export default function Sidebar({
	createNewNote,
}: SidebarProps): React.JSX.Element {
	return (
		<div className="w-1/5 h-screen bg-gray-200 p-4">
			<button
				onClick={createNewNote}
				className="bg-blue-500 text-white w-full py-2 rounded"
			>
				New Note
			</button>
		</div>
	);
}
