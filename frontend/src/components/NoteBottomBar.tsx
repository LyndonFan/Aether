import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import PreviewIcon from "@mui/icons-material/Preview";

export interface NoteBottomProps {
	isView: boolean;
	updateToView: (isView: boolean) => void;
	copyToClipboard: () => void;
	downloadNote: () => void;
	deleteNote: () => void;
}

export default function NoteBottomBar({
	isView,
	updateToView,
	copyToClipboard,
	downloadNote,
	deleteNote,
}: NoteBottomProps): React.JSX.Element {
	const [showCopyMessage, setShowCopyMessage] =
		React.useState(false);

	const handleCopyClick = () => {
		setShowCopyMessage(true);
		copyToClipboard();
		setTimeout(() => setShowCopyMessage(false), 1000);
	};

	// isView logic is intentionally reversed:
	// if isView is true, show edit icon to let them know clicking it switches to editing
	// if isView is false, show preview icon to let them know clicking it switches to preview
	return (
		<span>
			{isView ? (
				<EditIcon onClick={() => updateToView(true)} />
			) : (
				<PreviewIcon onClick={() => updateToView(false)} />
			)}
			<DownloadIcon onClick={downloadNote} />
			<ContentCopyIcon onClick={handleCopyClick} />
			{showCopyMessage && (
				<p className="text-gray-500 text-sm">Copied!</p>
			)}
			<DeleteIcon onClick={deleteNote} />
		</span>
	);
}
