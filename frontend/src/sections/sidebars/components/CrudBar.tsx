import React, { ChangeEvent, useState } from "react";

interface CrudBarProps {
	createNewNotes: (
		initialNoteContents: (string | null)[]
	) => void;
}

export default function CrudBar({
	createNewNotes,
}: CrudBarProps): React.JSX.Element {
	const BUTTON_STYLING_CLASS_NAME =
		"bg-teal-500 text-white w-full py-2 rounded";

	const DISABLED_BUTTON_STYLING_CLASS_NAME =
		"bg-gray-500 text-white w-full py-2 rounded";

	const newNoteFromClipboard = () => {
		navigator.clipboard
			.readText()
			.then((content) => createNewNotes([content]));
	};

	const [uploadedFileContents, setUploadedFileContents] =
		useState<Map<string, string>>(new Map());

	const onReceiveFileInput = async (
		event: ChangeEvent<HTMLInputElement>
	) => {
		console.log(event);
		const files = event.target.files
			? [...event.target.files]
			: [];
		const newContents: Map<string, string> = new Map();
		const promises = files.map((file) => {
			return new Promise((resolve, reject) => {
				let reader = new FileReader();
				reader.onload = () => {
					newContents.set(
						file.name,
						reader.result as string
					);
					resolve(null);
				};
				reader.onerror = null;
				reader.readAsText(file);
			});
		});
		await Promise.all(promises);
		setUploadedFileContents(
			new Map([
				...uploadedFileContents.entries(),
				...newContents.entries(),
			])
		);
	};

	const onSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		createNewNotes([...uploadedFileContents.values()]);
		setUploadedFileContents(new Map());
		let fileInputElement =
			document.getElementById("file-uploads")!;
		(fileInputElement as HTMLInputElement).value = "";
	};

	return (
		<div className="w-1/2 max-w-1/2 h-screen bg-gray-200 p-4 space-y-4">
			<button
				onClick={() => createNewNotes([null])}
				className={BUTTON_STYLING_CLASS_NAME}
			>
				New Blank Note
			</button>
			<button
				onClick={newNoteFromClipboard}
				className={BUTTON_STYLING_CLASS_NAME}
			>
				Import from Clipboard
			</button>
			<form className="flex-col space-y-4">
				<input
					className={
						uploadedFileContents.size === 0
							? DISABLED_BUTTON_STYLING_CLASS_NAME
							: BUTTON_STYLING_CLASS_NAME
					}
					type="submit"
					disabled={uploadedFileContents.size === 0}
					value={`Import Notes\nfrom ${
						uploadedFileContents.size
					} File${
						uploadedFileContents.size === 1 ? "" : "s"
					}`}
					onClick={onSubmit}
				/>
				<label
					className={
						BUTTON_STYLING_CLASS_NAME +
						" flex justify-center"
					}
					htmlFor="file-uploads"
				>
					Choose files
					<input
						id="file-uploads"
						type="file"
						accept=".md,.txt"
						hidden={true}
						multiple
						onChange={onReceiveFileInput}
					/>
				</label>
			</form>
			{uploadedFileContents.size > 0 && (
				<div className="px-4">
					Chosen files:
					<ul className="list-disc">
						{[...uploadedFileContents.entries()].map(
							([fileName, _]) => (
								<li key={fileName}>
									{fileName.length <= 20
										? fileName
										: fileName.substring(0, 16) +
										  "..." +
										  fileName.split(".")[
												fileName.split(".").length - 1
										  ]}
								</li>
							)
						)}
					</ul>
				</div>
			)}
		</div>
	);
}
