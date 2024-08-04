import React from "react";

interface NoteListProps {
	notes: { id: string; title: string }[];
	selectNote: (id: string) => void;
}

export default function NoteList({
	notes,
	selectNote,
}: NoteListProps): React.JSX.Element {
	return (
		<div className="w-1/5 h-screen bg-gray-100 p-4">
			<input
				type="text"
				placeholder="Search..."
				className="w-full mb-4 p-2 border rounded"
			/>
			<ul>
				{notes.map((note) => (
					<li key={note.id}>
						<button
							onClick={() => selectNote(note.id)}
							className="text-left w-full p-2 mb-2 border rounded hover:bg-gray-200"
						>
							{note.title}
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}
