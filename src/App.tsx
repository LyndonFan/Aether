import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import NoteList from "./components/NoteList";
import NoteEditor from "./components/NoteEditor";
import { v4 as uuid } from "uuid";

interface Note {
	id: string;
	title: string;
	content: string;
}

const NOTE_FIELD_PREFIX = "notes-aether-";

export default function App(): React.JSX.Element {
	const [notes, setNotes] = useState<Map<string, Note>>(
		new Map()
	);
	const [currentNoteId, setCurrentNoteId] = useState<
		string | null
	>(null);

	useEffect(() => {
		const savedNotes: Map<string, Note> = new Map();
		for (const storage_key in localStorage) {
			if (
				storage_key.startsWith(NOTE_FIELD_PREFIX) &&
				localStorage.getItem(storage_key) !== null
			) {
				const note_key = storage_key.replace(
					NOTE_FIELD_PREFIX,
					""
				);
				savedNotes.set(
					note_key,
					JSON.parse(localStorage.getItem(storage_key)!)
				);
			}
		}
		if (savedNotes.size > 0) {
			setNotes(savedNotes);
		}
	}, []);

	const createNewNote = () => {
		const newNote: Note = {
			id: uuid(),
			title: "New Note",
			content: "Hello world!",
		};
		setNotes(new Map([...notes, [newNote.id, newNote]]));
		localStorage.setItem(
			NOTE_FIELD_PREFIX + newNote.id,
			JSON.stringify(newNote)
		);
		setCurrentNoteId(newNote.id);
	};

	const selectNote = (id: string) => {
		setCurrentNoteId(id);
	};

	const updateNoteContent = (content: string) => {
		setNotes(
			new Map(
				[...notes].map(([key, note]) =>
					key === currentNoteId
						? [key, { ...note, content: content }]
						: [key, note]
				)
			)
		);
		if (
			currentNoteId !== null &&
			notes.has(currentNoteId)
		) {
			localStorage.setItem(
				NOTE_FIELD_PREFIX + currentNoteId,
				JSON.stringify(notes.get(currentNoteId)!)
			);
		}
	};

	const currentNote = currentNoteId
		? notes.get(currentNoteId)
		: undefined;

	const noteList = [...notes.values()];

	return (
		<div className="flex">
			<Sidebar createNewNote={createNewNote} />
			<NoteList notes={noteList} selectNote={selectNote} />
			{currentNote && (
				<NoteEditor
					noteContent={currentNote.content}
					updateNoteContent={updateNoteContent}
				/>
			)}
		</div>
	);
}
