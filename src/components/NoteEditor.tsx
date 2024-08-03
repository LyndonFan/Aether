import React from "react";

interface NoteEditorProps {
	noteContent: string[];
	updateNoteContent: (
		lineIndex: number,
		content: string
	) => void;
}

export default function NoteEditor({
	noteContent,
	updateNoteContent,
}: NoteEditorProps): React.JSX.Element {
	return (
		<div className="flex-1 h-screen p-4">
			{noteContent.map((line, index) => (
				<div
					key={index}
					contentEditable
					className="border-b p-2"
					onInput={(e) =>
						updateNoteContent(
							index,
							(e.target as HTMLDivElement).innerText
						)
					}
				>
					{line}
				</div>
			))}
		</div>
	);
}
