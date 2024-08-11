import React, { useState, useRef, useEffect } from "react";

interface NoteListProps {
	notes: { note_id: string; title: string }[];
	selectNote: (note_id: string) => void;
}

const BACKEND_WEB_SOCKET_URL = "ws://localhost:8000";

interface DisplayNoteCover {
	note_id: string;
	title: string;
	rank: number; // lower rank = higher in list
	rank_display?: string;
}

export default function NoteList({
	notes,
	selectNote,
}: NoteListProps): React.JSX.Element {
	const [searchTerm, setSearchTerm] = useState("");
	const searchSocketRef = useRef<WebSocket | null>(null);

	const defaultNoteListCompare = (
		noteA: { note_id: string; title: string },
		noteB: { note_id: string; title: string }
	) => {
		if (noteA.title !== noteB.title) {
			return noteA.title.localeCompare(noteB.title);
		}
		return noteA.note_id.localeCompare(noteB.note_id);
	};

	const [initialNotes, _] = useState<DisplayNoteCover[]>(
		notes
			.sort(defaultNoteListCompare)
			.map((note, index) => ({ ...note, rank: index }))
	);
	const [internalNoteList, setInternalNoteList] = useState<
		DisplayNoteCover[]
	>(
		notes
			.sort(defaultNoteListCompare)
			.map((note, index) => ({ ...note, rank: index }))
	);

	useEffect(() => {
		const exactSearchSocket = new WebSocket(
			`${BACKEND_WEB_SOCKET_URL}/search/exact`
		);
		searchSocketRef.current = exactSearchSocket;
		exactSearchSocket.onmessage = (event) => {
			const rows = JSON.parse(event.data);
			console.log(rows);
			setInternalNoteList(
				rows.map(
					(row: {
						note_id: string;
						title: string;
						num_occurrences: number;
					}) => {
						return {
							note_id: row.note_id,
							title: row.title,
							rank: -row.num_occurrences,
							rank_display: `${row.num_occurrences} time${
								row.num_occurrences > 1 ? "s" : ""
							}`,
						};
					}
				)
			);
		};
	}, []);

	const onSearch = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const newSearchTerm = event.target.value;
		setSearchTerm(event.target.value);
		if (newSearchTerm === "") {
			setInternalNoteList(initialNotes);
		} else {
			searchSocketRef.current!.send(event.target.value);
		}
	};

	const compareByRank = (
		noteA: DisplayNoteCover,
		noteB: DisplayNoteCover
	) => {
		if (noteA.rank !== noteB.rank) {
			return noteA.rank - noteB.rank;
		}
		if (noteA.title !== noteB.title) {
			return noteA.title.localeCompare(noteB.title);
		}
		return noteA.note_id.localeCompare(noteB.note_id);
	};

	return (
		<div className="w-1/4 h-screen bg-gray-100 p-4">
			<input
				type="text"
				placeholder="Search..."
				className="w-full mb-4 p-2 border rounded"
				value={searchTerm}
				onChange={onSearch}
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
					{internalNoteList
						.sort(compareByRank)
						.map((note) => (
							<li key={note.note_id}>
								<button
									onClick={() => selectNote(note.note_id)}
									className="text-left w-full p-2 mb-2 border rounded hover:bg-gray-200"
								>
									<span className="text-xs">
										{note.title}
										{note.rank_display ? (
											<span>
												<br />({note.rank_display!})
											</span>
										) : null}
									</span>
								</button>
							</li>
						))}
				</ul>
			</div>
		</div>
	);
}
