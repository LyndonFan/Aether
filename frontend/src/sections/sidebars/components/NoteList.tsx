import React, {
	useState,
	useRef,
	useEffect,
	useMemo,
} from "react";

interface NoteListProps {
	notes: { note_id: string; title: string }[];
	selectNote: (note_id: string) => void;
}

const BACKEND_HOST_PORT =
	process.env.REACT_APP_DATABASE_HOST_PORT;
const BACKEND_WEB_SOCKET_URL = `ws://${BACKEND_HOST_PORT}`;

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
	const [searchType, setSearchType] = useState<
		"exact" | "regex" | "semantic"
	>("exact");

	const parseResponse = (
		rows: {
			note_id: string;
			title: string;
			num_occurrences?: number; // exactly one of num_occurrences or distance will be present in the whole array
			distance?: number;
		}[]
	) => {
		return rows.map((row) => {
			return {
				note_id: row.note_id,
				title: row.title,
				rank: row.num_occurrences
					? -row.num_occurrences
					: row.distance!,
				rank_display: row.num_occurrences
					? `${row.num_occurrences} time${
							row.num_occurrences > 1 ? "s" : ""
					  }`
					: `Distance ${Number(row.distance!).toFixed(3)}`,
			};
		});
	};

	const webSocketURL = `${BACKEND_WEB_SOCKET_URL}/search`;

	const searchSocketRef = useRef<WebSocket | null>();

	useEffect(() => {
		const socket = new WebSocket(webSocketURL);
		socket.onmessage = (event) => {
			const rows = JSON.parse(event.data);
			console.log(rows);
			setInternalNoteList(parseResponse(rows));
		};
		socket.onopen = () => {
			socket.send(JSON.stringify({ search_type: "exact" }));
		};
		searchSocketRef.current = socket;
	}, [webSocketURL]);

	const handleSend = (data: string) => {
		if (searchSocketRef.current === null) {
			setTimeout(() => {
				handleSend(data);
			}, 1000);
			return;
		}
		if (
			searchSocketRef.current?.readyState === WebSocket.OPEN
		) {
			searchSocketRef.current.send(data);
		} else if (
			searchSocketRef.current?.readyState ===
			WebSocket.CONNECTING
		) {
			searchSocketRef.current.onopen = () => {
				searchSocketRef.current!.send(data);
			};
		} else {
			console.error("WebSocket is not open");
		}
	};

	const defaultNoteListCompare = (
		noteA: { note_id: string; title: string },
		noteB: { note_id: string; title: string }
	) => {
		if (noteA.title !== noteB.title) {
			return noteA.title.localeCompare(noteB.title);
		}
		return noteA.note_id.localeCompare(noteB.note_id);
	};

	const initialNotes = useMemo(() => {
		return notes
			.sort(defaultNoteListCompare)
			.map((note, index) => ({ ...note, rank: index }));
	}, [notes]);

	const [internalNoteList, setInternalNoteList] = useState<
		DisplayNoteCover[]
	>(
		notes
			.sort(defaultNoteListCompare)
			.map((note, index) => ({ ...note, rank: index }))
	);

	const onSearch = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const newSearchTerm = event.target.value;
		setSearchTerm(event.target.value);
		if (newSearchTerm === "") {
			setInternalNoteList(initialNotes);
		} else {
			handleSend(
				JSON.stringify({ search_term: event.target.value })
			);
		}
	};

	const onChangeSearchType = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		setSearchType(
			event.target.value as "exact" | "regex" | "semantic"
		);
		handleSend(
			JSON.stringify({ search_type: event.target.value })
		);
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
		<div className="w-1/2 h-screen bg-gray-100 p-4">
			<div className="flex items-center">
				<input
					type="text"
					placeholder="Search..."
					className="w-full mb-4 p-2 border rounded"
					value={searchTerm}
					onChange={onSearch}
				/>
				<div className="ml-2">
					<select
						value={searchType}
						onChange={onChangeSearchType}
					>
						<option value="exact">Exact</option>
						<option value="regex">Regex</option>
						<option value="semantic">Semantic</option>
					</select>
				</div>
			</div>
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
