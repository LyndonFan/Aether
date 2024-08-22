import CrudBar from "./components/CrudBar";
import NoteList from "./components/NoteList";

interface SidebarsProps {
	noteList: { note_id: string; title: string }[];
	selectNote: (note_id: string) => void;
	createNewNotes: (
		initialNoteContents: (string | null)[]
	) => void;
}

export default function Sidebars({
	noteList,
	selectNote,
	createNewNotes,
}: SidebarsProps): React.JSX.Element {
	return (
		<div className="flex w-2/5 h-full">
			<CrudBar createNewNotes={createNewNotes} />
			<NoteList notes={noteList} selectNote={selectNote} />
		</div>
	);
}
