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
import { color } from "@mui/system";
import Button from "@mui/material/Button";
import zIndex from "@mui/material/styles/zIndex";
import { Collapse, Fade, Slide } from "@mui/material";
import { transform } from "typescript";

const fronts = ["# one", "## two", "### three"];
const backs = ["one", "$$\n{\\sqrt{a^2 + b^2} = c \\over 2}\n$$", "three"];

export default function App() {
	useEffect(disableTouchMoveOnBody, []); // Called on mount (once only)
	const [markdown, setMarkdown] = useState("");
	const [showToolbar, setShowToolbar] = useState(true);
	const cardIndexRef = useRef(0);
	const cardDidMoveRef = useRef(false);
	console.log(`window.screen.availHeight: ${window.screen.availHeight}`);
	console.log(`window.screen.height: ${window.screen.height}`);
	console.log(`window.innerHeight: ${window.innerHeight}`);
	return (
		<div className="App" style={{
			height: `${window.innerHeight - 10}px`,
			textAlign: "center"}}
		>
			<Button onClick={(e) => setShowToolbar(!showToolbar)} 
				style={{
					position: "absolute", 
					zIndex: 2, 
					color: "black",
					transform: `rotate(${showToolbar ? 0 : 180}deg)`,
					transition: "transform 0.6s"
				}}
			>show</Button>
			<Slide in={showToolbar} mountOnEnter={true} timeout={500}>
				<Toolbar className="tb" disableGutters={true} style={{
					position: "absolute", 
					background: "green",
					width: "100%",
					zIndex: 1}}>
					<UploadButton setMarkdown={setMarkdown} indexRef={cardIndexRef} />
					<Typography>{`${cardIndexRef.current}/${fronts.length}`}</Typography>
				</Toolbar>
			</Slide>
			{/* <div style={{height: `${500}`}}> */}
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
			{/* </div> */}
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