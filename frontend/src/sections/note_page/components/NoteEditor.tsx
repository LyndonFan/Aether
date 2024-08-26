import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import {
	markdown,
	markdownLanguage,
} from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { EditorView } from "@codemirror/view";

export interface NoteEditorProps {
	noteContent: string;
	updateNote: (title: string, content: string) => void;
}

const basicSetupOptions = {
	lineNumbers: true,
};

export default function NoteEditor({
	noteContent,
	updateNote,
}: NoteEditorProps): React.JSX.Element {
	return (
		<CodeMirror
			value={noteContent}
			className="h-7/8 max-h-7/8 max-w-100vh overflow-y-auto"
			basicSetup={basicSetupOptions}
			extensions={[
				markdown({
					base: markdownLanguage,
					codeLanguages: languages,
				}),
				EditorView.lineWrapping,
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
