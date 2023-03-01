import Button from "@mui/material/Button";
import { ChangeEvent, Dispatch, SetStateAction } from "react";

type UploadButtonProps = {
    setMarkdown: Dispatch<SetStateAction<string>>,
    indexRef: React.MutableRefObject<number>
}

export default function UploadButton({setMarkdown, indexRef}: UploadButtonProps) {
    return (
        <Button variant="contained" component="label">
            Upload
            <input 
                hidden 
                type="file" 
                onChange={e => readFile(e, setMarkdown, indexRef)} 
            />
		</Button>
    )
}

// Helper Functions
// *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

function readFile(e: ChangeEvent<HTMLInputElement>, setMarkdown: Dispatch<SetStateAction<string>>, indexRef: React.MutableRefObject<number>) {
	indexRef.current = 0;
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