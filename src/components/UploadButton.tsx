import Button from "@mui/material/Button";
import { ChangeEvent, Dispatch, SetStateAction } from "react";

interface UploadButtonProps {
    setMarkdown: Dispatch<SetStateAction<string>>,
    setIndex: Dispatch<SetStateAction<number>>
}

export default function UploadButton({setMarkdown, setIndex}: UploadButtonProps) {
    return (
        <Button variant="contained" component="label">
            Upload
            <input 
                hidden 
                type="file" 
                onChange={e => readFile(e, setMarkdown, setIndex)} 
            />
		</Button>
    )
}

// Helper Functions
// *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

function readFile(e: ChangeEvent<HTMLInputElement>, setMarkdown: Dispatch<SetStateAction<string>>, setIndex: Dispatch<SetStateAction<number>>) {
	setIndex(0);
	if (e.target.files == null) {
		setMarkdown("");
		return;
	}
	const reader = new FileReader();
	reader.onload = () => {
		setMarkdown(typeof reader.result === "string" ? reader.result : "");
	};
	reader.readAsText(e.target.files[0]);
}