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

export default function NoteUtilityBar({
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

	return (
		<span>
			{isView ? (
				<EditIcon onClick={() => updateToView(false)} />
			) : (
				<PreviewIcon onClick={() => updateToView(true)} />
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
