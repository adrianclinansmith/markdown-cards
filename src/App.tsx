/*
	react-syntax-highlighter style issue:
	https://github.com/react-syntax-highlighter/react-syntax-highlighter/issues/479
*/

import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css'
import { useEffect, useRef, useState } from "react";

import MdCodeBlock from "./components/MdCodeBlock";
import UploadButton from "./components/UploadButton";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import Swiper from "./components/Swiper";
import FlipItem from "./components/FlipItem";

const fronts = ["# one", "## two", "### three"];
const backs = ["one", "$$\n{\\sqrt{a^2 + b^2} = c \\over 2}\n$$", "three"];

export default function App() {
	useEffect(disableTouchMoveOnBody, []); // Called on mount (once only)
	const [markdown, setMarkdown] = useState("");
	const cardIndexRef = useRef(0);
	const cardDidMoveRef = useRef(false);
	return (
		<div className="App" style={{height: `${window.screen.availHeight}px`}}>
			<Toolbar>
				<UploadButton setMarkdown={setMarkdown} indexRef={cardIndexRef} />
				<Typography>{`${cardIndexRef.current}/${fronts.length}`}</Typography>
			</Toolbar>
			<Swiper didMoveRef={cardDidMoveRef} indexRef={cardIndexRef}>
				{fronts.map((front, index) => 
					<FlipItem disabled={cardDidMoveRef} index={index} key={index}>
						<ReactMarkdown 
							children={front}
							components={{code: MdCodeBlock}}
							rehypePlugins={[rehypeKatex]}
							remarkPlugins={[remarkGfm, remarkMath]}
						/>
						<ReactMarkdown 
							children={backs[index]}
							components={{code: MdCodeBlock}}
							rehypePlugins={[rehypeKatex]}
							remarkPlugins={[remarkGfm, remarkMath]}
						/>
					</FlipItem>
				)}
			</Swiper>
		</div>
	);
}

// *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
// Helper Functions
// *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

function disableTouchMoveOnBody() {
	/* On mobile this prevents the screen from moving around when the user
	tries to swipe the cards.  
	src: https://stackoverflow.com/questions/7768269/ipad-safari-disable-scrolling-and-bounce-effect*/
	document.body.addEventListener("touchmove",
		(e) => { e.preventDefault(); console.log("Called touchmove");}, 
		{ passive: false }
	);
}

function splitIntoCards(markdown: string) {
	/* cards[2n] is <front of card> and cards[2n+1] is <back of card>
	cards.length >= 2 and cards.length % 2 == 0 */
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