import React from "react";

interface NoteListProps {
	notes: { id: string; title: string }[];
	selectNote: (id: string) => void;
}

export default function NoteList({
	notes,
	selectNote,
}: NoteListProps): React.JSX.Element {
	const compare = (
		noteA: { id: string; title: string },
		noteB: { id: string; title: string }
	) => {
		if (noteA.title !== noteB.title) {
			return noteA.title.localeCompare(noteB.title);
		}
		return noteA.id.localeCompare(noteB.id);
	};
	return (
		<div className="w-1/4 h-screen bg-gray-100 p-4">
			<input
				type="text"
				placeholder="Search..."
				className="w-full mb-4 p-2 border rounded"
			/>
			<div
				className="max-h-7/8 overflow-y-auto"
				style={{ overscrollBehavior: "contain" }}
			>
				<ul
					style={{
						display: "flex",
						flexDirection: "column",
						gap: "4px",
					}}
				>
					{notes.sort(compare).map((note) => (
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
		</div>
	);
}
