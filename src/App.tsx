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

	const saveNote = (note: Note) => {
		localStorage.setItem(
			NOTE_FIELD_PREFIX + note.id,
			JSON.stringify(note)
		);
	};

	const updateTitle = (title: string) => {
		if (!currentNote) {
			return;
		}
		setNotes((prevMap) => {
			return new Map(
				prevMap.set(currentNoteId!, {
					...currentNote,
					title: title,
				})
			);
		});
		saveNote({ ...currentNote!, title: title });
	};

	const updateNoteContent = (content: string) => {
		if (!currentNote) {
			let newNote = {
				id: currentNoteId!,
				title: content.split("\n", 1)[0],
				content: content,
			};
			setNotes((prevMap) => {
				return new Map(
					prevMap.set(currentNoteId!, newNote)
				);
			});
			saveNote(newNote);
		} else {
			setNotes((prevMap) => {
				return new Map(
					prevMap.set(currentNoteId!, {
						...currentNote,
						content: content,
					})
				);
			});
			saveNote({ ...currentNote!, content: content });
		}
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
				<NoteEditor
					noteContent={currentNote.content}
					updateNoteContent={updateNoteContent}
					updateTitle={updateTitle}
				/>
			)}
		</div>
	);
}
