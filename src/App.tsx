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

function readFile(e: ChangeEvent<HTMLInputElement>, setString: Dispatch<React.SetStateAction<string>>, setNumber: Dispatch<React.SetStateAction<number>>) {
	setNumber(0);
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

function splitIntoCards(markdown: string) {
	/* cards.length >= 2 and cards.length % 2 == 0 */
	const cards: string[] = [];
	let inCodeblock = false;
	for (const line of markdown.split("\n")) {
		if (line.startsWith("#") && !inCodeblock) {
			cards.push(line, "");
			continue;
		}
		if (cards.length === 0) {
			cards.push("", "");
		}
		cards.push(cards.pop() + "\n" + line);
		inCodeblock = inCodeblock !== line.startsWith("```"); // XOR
	}
	console.log(cards);
	return cards;
}

function App() {
	console.log("CALLED APP");
	const [markdown, setMarkdown] = useState("");
	const [index, setIndex] = useState(0);
	// const cards = markdown.match(/#{1,4}[^#]+/g) || [markdown];
	const cards = splitIntoCards(markdown);
	console.log(cards);
	document.onkeydown = (e: KeyboardEvent) => {
		console.log("pressed key: " + e.key);
		if (e.key === "ArrowLeft") {
			setIndex(index > 0 ? index - 1 : cards.length - 1);
		} else if (e.key === "ArrowRight") {
			setIndex((index + 1) % cards.length);
		}
	}
	return (
		<div className="App">
			<Button variant="contained" component="label">
				Upload
				<input 
					hidden 
					type="file" 
					onChange={e => readFile(e, setMarkdown, setIndex)} 
				/>
			</Button>
			<ReactMarkdown 
				children={cards[index]}
				components={{code: MdCodeBlock}}
				rehypePlugins={[rehypeKatex]}
				remarkPlugins={[remarkGfm, remarkMath]}
			/>
		</div>
	);
}

export default App;
