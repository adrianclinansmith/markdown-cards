/*
	react-syntax-highlighter style issue:
	https://github.com/react-syntax-highlighter/react-syntax-highlighter/issues/479
*/

import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css'
import { useState } from "react";

import MdCodeBlock from "./components/MdCodeBlock";
import UploadButton from "./components/UploadButton";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

let pointerStart = 0;
let pointerIsDown = false;

export default function App() {
	const [markdown, setMarkdown] = useState("");
	const [index, setIndex] = useState(0);
	const [leftPosition, setLeftPosition] = useState(0);
	const cardContent = splitIntoCards(markdown);
	document.onkeydown = (e: KeyboardEvent) => {
		const evenIndex = index % 2 === 0;
		if (e.key === "ArrowLeft") {
			setIndex((index > 0 ? index : cardContent.length) - (evenIndex ? 2 : 1));
		} else if (e.key === "ArrowRight") {
			setIndex((index + (evenIndex ? 2 : 1)) % cardContent.length);
		} else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
			setIndex(index + (evenIndex ? 1 : -1));
		}
	};
	return (
		<div className="App">
			<UploadButton setMarkdown={setMarkdown} setIndex={setIndex} />
			<Card 
				onPointerDown={e => pointerDown(e, index, setIndex)}
				onPointerMove={e => pointerMove(e, index, setIndex, setLeftPosition)}
				onPointerUp={e => pointerUp(e, index, setIndex)}
				sx={{position: "relative", left: `${leftPosition}px`}}
			>
				<CardContent>
					<ReactMarkdown 
						children={cardContent[index]}
						components={{code: MdCodeBlock}}
						rehypePlugins={[rehypeKatex]}
						remarkPlugins={[remarkGfm, remarkMath]}
					/>
				</CardContent>
			</Card>
		</div>
	);
}

// Helper Functions
// *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

function splitIntoCards(markdown: string) {
	/* cards[2n] is <front of card> and cards[2n+1] is <back of card>
	cards.length >= 2 && cards.length % 2 == 0 */
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

function pointerDown(e: React.PointerEvent<HTMLDivElement>, index: number, setIndex: React.Dispatch<React.SetStateAction<number>>) {
	pointerIsDown = true;
	pointerStart = e.clientX;
	console.log(`pointerDown (${e.clientX}, ${e.clientY})`);
}

function pointerMove(e: React.PointerEvent<HTMLDivElement>, index: number, setIndex: React.Dispatch<React.SetStateAction<number>>, setHorizontalPos: React.Dispatch<React.SetStateAction<number>>) {
	if (!pointerIsDown) {
		return;
	}
	setHorizontalPos(e.clientX - pointerStart);
	console.log(`pointerMove (${e.clientX}, ${e.clientY})`);
}

function pointerUp(e: React.PointerEvent<HTMLDivElement>, index: number, setIndex: React.Dispatch<React.SetStateAction<number>>) {
	pointerIsDown = false;
	setIndex(index + (index % 2 === 0 ? 1 : -1));
	console.log(`pointerUp (${e.clientX}, ${e.clientY})`);
}