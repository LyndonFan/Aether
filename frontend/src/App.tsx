import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import NoteList from "./components/NoteList";
import { v4 as uuid } from "uuid";
import NotePage from "./components/NotePage";

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

	const createNewNote = (
		initialNoteContent: string | null
	) => {
		const newNote: Note = {
			id: uuid(),
			title: "",
			content:
				initialNoteContent || "# New Note\n\nHello world!",
		};
		newNote.title = newNote.content.split("\n", 1)[0];
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

	const saveNote = (note: Note) => {
		localStorage.setItem(
			NOTE_FIELD_PREFIX + note.id,
			JSON.stringify(note)
		);
	};

	const updateNote = (title: string, content: string) => {
		if (!currentNote) {
			return;
		}
		setNotes((prevMap) => {
			return new Map(
				prevMap.set(currentNoteId!, {
					...currentNote,
					title: title,
					content: content,
				})
			);
		});
		saveNote({
			...currentNote!,
			title: title,
			content: content,
		});
	};

	const deleteNote = () => {
		if (!currentNote) {
			return;
		}
		setNotes((prevMap) => {
			prevMap.delete(currentNoteId!);
			return new Map(prevMap);
		});
		localStorage.removeItem(
			NOTE_FIELD_PREFIX + currentNoteId!
		);
		setCurrentNoteId(null);
	};

	const currentNote = currentNoteId
		? notes.get(currentNoteId)
		: undefined;

	const noteList = [...notes].map(([key, note]) => {
		return { id: key, title: note.title };
	});

	return (
		<div className="flex">
			<Sidebar createNewNote={createNewNote} />
			<NoteList notes={noteList} selectNote={selectNote} />
			{currentNote && (
				<NotePage
					noteContent={currentNote.content}
					updateNote={updateNote}
					deleteNote={deleteNote}
				/>
			)}
		</div>
	);
}
