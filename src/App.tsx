import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import NoteList from "./components/NoteList";
import NoteEditor from "./components/NoteEditor";
import { v4 as uuid } from "uuid";

interface Note {
	id: string;
	title: string;
	content: string;
}

export default function App(): React.JSX.Element {
	const [notes, setNotes] = useState<Note[]>([]);
	const [currentNoteId, setCurrentNoteId] = useState<
		string | null
	>(null);

	const createNewNote = () => {
		const newNote: Note = {
			id: uuid(),
			title: `Untitled Note ${notes.length + 1}`,
			content: "Hello world!",
		};
		setNotes([...notes, newNote]);
		setCurrentNoteId(newNote.id);
	};

	const selectNote = (id: string) => {
		setCurrentNoteId(id);
	};

	const updateNoteContent = (content: string) => {
		setNotes(
			notes.map((note) =>
				note.id === currentNoteId
					? {
							...note,
							content: content,
					  }
					: note
			)
		);
	};

	const currentNote = notes.find(
		(note) => note.id === currentNoteId
	);

	return (
		<div className="flex">
			<Sidebar createNewNote={createNewNote} />
			<NoteList notes={notes} selectNote={selectNote} />
			{currentNote && (
				<NoteEditor
					noteContent={currentNote.content}
					updateNoteContent={updateNoteContent}
				/>
			)}
		</div>
	);
}
