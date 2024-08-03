import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import {
	markdown,
	markdownLanguage,
} from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";

interface NoteEditorProps {
	noteContent: string;
	updateNoteContent: (content: string) => void;
}

export default function NoteEditor({
	noteContent,
	updateNoteContent,
}: NoteEditorProps): React.JSX.Element {
	return (
		<CodeMirror
			value={noteContent}
			extensions={[
				markdown({
					base: markdownLanguage,
					codeLanguages: languages,
				}),
			]}
			onChange={updateNoteContent}
		/>
	);
}
