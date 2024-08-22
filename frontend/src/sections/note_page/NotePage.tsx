import React from "react";
import { useState } from "react";
import NoteEditor from "./components/NoteEditor";
import NoteUtilityBar from "./components/NoteUtilityBar";
import NotePreview from "./components/NotePreview";

interface NotePageProps {
	noteContent: string;
	updateNote: (title: string, content: string) => void;
	deleteNote: () => void;
}

export default function NotePage({
	noteContent,
	updateNote,
	deleteNote,
}: NotePageProps): React.JSX.Element {
	const [isView, setIsView] = useState(false);

	const copyToClipboard = () => {
		navigator.clipboard.writeText(noteContent);
	};

	const downloadNote = () => {
		const blob = new Blob([noteContent], {
			type: "text/plain",
		});
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.download = "note.md";
		link.href = url;
		link.click();
	};

	const deleteNoteHandler = () => {
		window.confirm(
			"Are you sure you want to delete this note?"
		) && deleteNote();
	};

	return (
		<div className="h-screen w-full flex flex-col max-w-3/5">
			<div className="mt-auto h-8">
				<NoteUtilityBar
					isView={isView}
					updateToView={setIsView}
					copyToClipboard={copyToClipboard}
					downloadNote={downloadNote}
					deleteNote={deleteNoteHandler}
				/>
			</div>
			<div className="flex-grow h-full">
				{isView ? (
					<NotePreview noteContent={noteContent} />
				) : (
					<NoteEditor
						noteContent={noteContent}
						updateNote={updateNote}
					/>
				)}
			</div>
		</div>
	);
}
