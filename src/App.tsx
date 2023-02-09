/*
	react-syntax-highlighter style issue:
	https://github.com/react-syntax-highlighter/react-syntax-highlighter/issues/479
*/

import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css'
import Button from "@mui/material/Button";
import { ChangeEvent, Dispatch, useState } from "react";

import MdCodeBlock from "./components/MdCodeBlock";

function readFile(e: ChangeEvent<HTMLInputElement>, setString: Dispatch<React.SetStateAction<string>>) {
	if (e.target.files == null) {
		setString("");
		return;
	}
	const reader = new FileReader();
	reader.onload = () => {
		setString(typeof reader.result === "string" ? reader.result : "");
	};
	reader.readAsText(e.target.files[0]);
}

document.onkeydown = (e: KeyboardEvent) => {
	console.log("pressed key: " + e.key);
	if (e.key === "ArrowLeft") {
		console.log("\tpressed arrow left");
	} else if (e.key === "ArrowRight") {
		console.log("\tpressed arrow right");
	}
}

function App() {
	const [markdown, setMarkdown] = useState("");
	return (
		<div className="App">
			<Button variant="contained" component="label">
				Upload
				<input hidden type="file" onChange={e => readFile(e, setMarkdown)} />
			</Button>
			<ReactMarkdown 
				children={markdown}
				components={{code: MdCodeBlock}}
				rehypePlugins={[rehypeKatex]}
				remarkPlugins={[remarkGfm, remarkMath]}
			/>
		</div>
	);
}

export default App;
