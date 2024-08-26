import React, { useState, useEffect, useRef } from "react";
import { v4 as uuid } from "uuid";
import NotePage from "./sections/note_page/NotePage";
import Sidebars from "./sections/sidebars/Sidebars";

interface NoteCover {
	note_id: string;
	title: string;
}

interface Note extends NoteCover {
	content: string;
}

const BACKEND_HOST_PORT =
	process.env.REACT_APP_DATABASE_HOST_PORT;
const BACKEND_HTTP_URL = `http://${BACKEND_HOST_PORT}`;
const BACKEND_WEB_SOCKET_URL = `ws://${BACKEND_HOST_PORT}`;

export default function App(): React.JSX.Element {
	const [noteCovers, setNoteCovers] = useState<
		Map<string, NoteCover>
	>(new Map());
	const [currentNoteId, setCurrentNoteId] = useState<
		string | null
	>(null);
	const [currentNoteContent, setCurrentNoteContent] =
		useState<string>("");
	const noteUpdateSocketRef = useRef<WebSocket | null>(
		null
	);

	const handleSend = (
		socket: WebSocket,
		content: string
	) => {
		if (socket.readyState === WebSocket.OPEN) {
			socket.send(content);
		} else if (socket.readyState === WebSocket.CONNECTING) {
			socket.onopen = () => {
				socket.send(content);
			};
		}
	};

	useEffect(() => {
		const savedNotes: Map<string, Note> = new Map();
		fetch(BACKEND_HTTP_URL + "/notes", {
			mode: "cors",
		})
			.then((response) => {
				console.log(response);
				return response.json();
			})
			.then((data) => {
				for (const noteCover of data) {
					savedNotes.set(noteCover.note_id, noteCover);
				}
				if (savedNotes.size > 0) {
					setNoteCovers(savedNotes);
				}
			})
			.catch((error) => {
				console.error(error);
			});
	}, []);

	const createNewNotes = (
		initialNoteContents: (string | null)[]
	) => {
		const newNotes: Map<string, Note> = new Map();
		for (const content of initialNoteContents.values()) {
			const newNote: Note = {
				note_id: uuid(),
				title: "",
				content: content || "# New Note\n\nHello world!",
			};
			newNote.title = newNote.content.split("\n", 1)[0];
			newNotes.set(newNote.note_id, newNote);
		}
		fetch(BACKEND_HTTP_URL + "/notes", {
			mode: "cors",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify([...newNotes.values()]),
		});
		setNoteCovers(
			new Map([
				...noteCovers.entries(),
				...newNotes.entries(),
			])
		);
		if (newNotes.size === 1) {
			setCurrentNoteId(newNotes.keys().next().value);
		}
	};

	const selectNote = (note_id: string | null) => {
		setCurrentNoteId(note_id);
		noteUpdateSocketRef.current?.close();
		if (note_id === null) {
			noteUpdateSocketRef.current = null;
			return;
		}
		const webSocketURL = `${BACKEND_WEB_SOCKET_URL}/notes/${note_id}`;
		const newSocket = new WebSocket(webSocketURL);
		noteUpdateSocketRef.current = newSocket;
		newSocket.onmessage = (event) => {
			console.log(event.data);
			const note: Note = JSON.parse(event.data);
			setCurrentNoteContent(note.content);
			const { content: _, ...noteCover } = note;
			setNoteCovers((prevMap) => {
				return new Map(
					prevMap.set(note.note_id, noteCover)
				);
			});
		};
	};

	const saveNote = (note: Note) => {
		const dataToSend = JSON.stringify({
			title: note.title,
			content: note.content,
		});
		if (!noteUpdateSocketRef.current) {
			noteUpdateSocketRef.current = new WebSocket(
				`${BACKEND_HTTP_URL}/notes/${note.note_id}`
			);
		}
		handleSend(noteUpdateSocketRef.current, dataToSend);
	};

	const updateNote = (title: string, content: string) => {
		if (!currentNoteId) {
			return;
		}
		if (title !== currentNote!.title) {
			setNoteCovers((prevMap) => {
				return new Map(
					prevMap.set(currentNoteId!, {
						...currentNote!,
						title: title,
					})
				);
			});
		}
		saveNote({
			...currentNote!,
			title: title,
			content: content,
		});
	};

	const deleteNote = () => {
		if (!currentNoteId) {
			return;
		}
		setNoteCovers((prevMap) => {
			prevMap.delete(currentNoteId!);
			return new Map(prevMap);
		});
		fetch(BACKEND_HTTP_URL + "/notes/" + currentNoteId!, {
			mode: "cors",
			method: "DELETE",
		});
		selectNote(null);
		setCurrentNoteContent("");
	};

	const currentNote: Note | null = currentNoteId
		? {
				...noteCovers.get(currentNoteId)!,
				content: currentNoteContent,
		  }
		: null;

	const noteList = [...noteCovers].map(([key, note]) => {
		return { note_id: key, title: note.title };
	});

	return (
		<div className="flex">
			<Sidebars
				createNewNotes={createNewNotes}
				noteList={noteList}
				selectNote={selectNote}
			/>
			{currentNoteId && (
				<NotePage
					noteContent={currentNoteContent}
					updateNote={updateNote}
					deleteNote={deleteNote}
				/>
			)}
		</div>
	);
}
