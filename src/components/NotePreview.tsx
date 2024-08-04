import React from "react";
import Markdown from "react-markdown";
import "./NotePreview.css";

interface NotePreviewProps {
	noteContent: string;
}

export default function NotePreview({
	noteContent,
}: NotePreviewProps): React.JSX.Element {
	return (
		<Markdown className="rendered-markdown prose">
			{noteContent}
		</Markdown>
	);
}
