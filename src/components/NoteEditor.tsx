import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import {
	markdown,
	markdownLanguage,
} from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";

export interface NoteEditorProps {
	noteContent: string;
	updateNote: (title: string, content: string) => void;
}

const basicSetupOptions = {
	lineNumbers: false,
};

export default function NoteEditor({
	noteContent,
	updateNote,
}: NoteEditorProps): React.JSX.Element {
	return (
		<CodeMirror
			value={noteContent}
			className="h-full w-full"
			basicSetup={basicSetupOptions}
			extensions={[
				markdown({
					base: markdownLanguage,
					codeLanguages: languages,
				}),
			]}
			onChange={(val, viewChange) => {
				const view = viewChange.view;
				const doc = view.state.doc;
				const firstLine = doc.line(1);
				updateNote(firstLine.text, val);
			}}
		/>
	);
}
