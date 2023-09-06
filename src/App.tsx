import { useEffect, useRef, useState } from "react";
import './App.css';
import "katex/dist/katex.min.css";
import ToolbarItem from "./ToolbarItem";
import Card from "./Card";
import Md from "./Md";
import { defaultMarkdown } from "./DefaultMarkdown";
import {displayObserver, reobserve} from "./utils.ts"

export default function App() {
	// States
	const [md, setMd] = useState(defaultMarkdown);
	const [fontSize, setFontSize] = useState("medium");
	const [index, setIndex] = useState(1);
	// Variables
	const [cardFronts, cardBacks] = splitMarkdown(md);
	const observerCallback = (target: Element) => {
		setIndex(parseInt(/\d+/.exec(target.id)![0]));
	}
	// Refs
	const observerRef = useRef(displayObserver("deck", observerCallback));
	// Effects
	useEffect(() => {
		const mdElements = document.getElementsByClassName("react-markdown");
		for (const mdContent of mdElements) {
			(mdContent as HTMLElement).style.fontSize = fontSize;
		}
	}, [fontSize, md]);
	useEffect(() => {
		for (const card of document.getElementsByClassName("card")) {	
			reobserve(observerRef.current, card);
		}
	}, [md]);
	// JSX
	return (
		<div className="App">
			<header className="toolbar">
				<ToolbarItem id="uploader" setMd={setMd} />
				<ToolbarItem id="refresher" />
				<ToolbarItem id="font-size-picker" setFontSize={setFontSize} />
				<ToolbarItem id="toolbar-toggler" />
			</header>
			<div id="deck">
				{
					cardFronts.map((front, i) => 
						<Card position={i+1} key={i}>
							<Md>{front}</Md>
							<Md>{cardBacks[i]}</Md>
						</Card>
					)
				}
			</div>
			<button 
				id="card-index-display" 
				onClick={ e => e.currentTarget.classList.toggle("hide") }
			>
				{index} of {cardFronts.length}
			</button>
		</div>
	);
}

// *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
// Helper Functions
// *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

function isMathOrCodeDelimiter(s: string) {
	if (/^\$\$(?![^$]*\$\$)/.test(s)) {
		return "$$"
	}
	else if (/^```(?![^`]*```)/.test(s)) {
		return "```";
	}
	else if (/^~~~(?![^~]*~~~)/.test(s)) {
		return "~~~"
	}
	return false;
}

function splitMarkdown(md: string) {
	const fronts: string[] = [];
	const backs: string[] = [];
	const isH = (s: string) => /^#{1,6} /.test(s);
	if (!isH(md)) { // first line isn't a header
		fronts.push("");
		backs.push("");
	}
	let inMathOrCode: string | boolean = false;
	for (const line of md.split("\n")) {
		if (isH(line) && !inMathOrCode) {
			fronts.push(line);
			backs.push("");
		}
		else {
			backs.push(backs.pop() + line + "\n");
		}
		const delimiter = isMathOrCodeDelimiter(line);
		if (delimiter && !inMathOrCode) { // Enter math/code block
			inMathOrCode = delimiter;
		}
		else if (delimiter === inMathOrCode) { // Exit math/code block
			inMathOrCode = false;
		}
	}
	return [fronts, backs];
}