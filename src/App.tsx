import { useRef, useState } from "react";
import './App.css';
import "katex/dist/katex.min.css";
import ToolbarItem from "./ToolbarItem";
import Card from "./Card";
import Md from "./Md";
import { defaultMarkdown } from "./DefaultMarkdown";
import {displayObserver, resetDeck, toggleToolbar, fontSizeMap, useEffectUpdateOnly, useEffectFirstRenderOnly } from "./utils.ts"

window.onresize = () => {
	console.log("window resize"); // http://192.168.0.244:3000

}
// Get fontSize from localStorage or default to "medium"
let initialFontSize = getStoredFontSize();
if (!Object.values(fontSizeMap).includes(initialFontSize)) {
	initialFontSize = "medium";
}

// *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
// App Component
// *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

export default function App() {
	console.log("render app")
	// States
	const [md, setMd] = useState(defaultMarkdown);
	const [fontSize, setFontSize] = useState(initialFontSize);
	const [index, setIndex] = useState(1);
	// Variables
	const [cardFronts, cardBacks] = splitMarkdown(md);
	const observerCallback = (target: Element) => {
		setIndex(parseInt(/\d+/.exec(target.id)![0]));
	}
	// Refs
	const observerRef = useRef(displayObserver("deck", observerCallback));
	// Effects
	useEffectFirstRenderOnly(() => {
		console.log("useEffect FirstRenderOnly");
	});
	useEffectUpdateOnly(() => {
		console.log("useEffect UpdateOnly");
		toggleToolbar(document.getElementById("toolbar")!);
		resetDeck(document.getElementById("deck")!);
	}, md);
	// JSX
	return (
		<div className="App">
			<header id="toolbar">
				<ToolbarItem id="uploader" setMd={setMd} />
				<ToolbarItem id="refresher" />
				<ToolbarItem 
					id="font-size-picker" 
					fontSize={fontSize} 
					setFontSize={setFontSize}
				/>
				<ToolbarItem id="toolbar-toggler" />
			</header>
			<div id="deck" style={{fontSize: fontSize}}>
				{
					cardFronts.map((front, i) => 
						<Card position={i+1} key={i} observer={observerRef.current}>
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
// Private Functions
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

function getStoredFontSize() {
	/* Return fontSize from localStorage, or the empty string if it's not there
	or an error ocurred */
	try {
		return window.localStorage.getItem("fontSize") ?? "";
	} catch /* SecurityError: localStorage is probably disabled */ {
		return "";	
	}
}