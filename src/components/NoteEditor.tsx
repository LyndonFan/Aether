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
	updateTitle: (title: string) => void;
}

const basicSetupOptions = {
	lineNumbers: false,
};

export default function NoteEditor({
	noteContent,
	updateNoteContent,
	updateTitle,
}: NoteEditorProps): React.JSX.Element {
	return (
		<CodeMirror
			value={noteContent}
			className="h-screen w-screen"
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
				updateNoteContent(val);
				updateTitle(firstLine.text);
			}}
		/>
	);
}
