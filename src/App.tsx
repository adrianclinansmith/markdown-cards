import { useRef, useState } from "react";
import './App.css';
import "katex/dist/katex.min.css";
import ToolbarItem from "./ToolbarItem";
import Card from "./Card";
import { defaultMarkdown } from "./DefaultMarkdown";
import {
	displayObserver, resetDeck, toggleToolbar, useEffect_UpdateOnly,
	FontSizeAcronym 
} from "./utils.ts"

//#region On Script Load (/static/js/bundle.js)
// *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

window.onresize = () => {
	console.log("window resize"); // http://192.168.0.244:3000
}
// Get fontSizeAcronym from localStorage or default to "M"
const initialFontSize = getStoredFontSizeAcronym() as FontSizeAcronym;

//#endregion
//#region Component
// *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

export default function App() {
	console.log("\n\nrender app")
	// States
	const [md, setMd] = useState(defaultMarkdown);
	const [fontSize, setFontSize] = useState(initialFontSize);
	const [speak, setSpeak] = useState(false);
	// Variables
	const [cardFronts, cardBacks] = splitMarkdown(md);
	const observerCallback = (target: Element) => {
		const index = parseInt(/\d+/.exec(target.id)![0]);
		const indexDisplay = document.getElementById("card-index-display")!;
		const newText = indexDisplay.textContent!.replace(/\d+/, `${index}`);
		indexDisplay.textContent = newText;
	}
	// Refs
	const cardObserverRef = useRef(displayObserver("deck", observerCallback));
	// Effects
	useEffect_UpdateOnly(() => {
		console.log("useEffectUpdateOnly");
		const indexDisplay = document.getElementById("card-index-display")!;
		const numberOfCards = `${cardFronts.length}`;
		const text = indexDisplay.textContent!.replace(/\d+$/, numberOfCards);
		indexDisplay.textContent = text;
		toggleToolbar();
		resetDeck();
	}, md);
	// JSX
	return (
		<div className="App">
			<header id="toolbar">
				<ToolbarItem id="uploader" setMd={setMd} />
				<ToolbarItem id="resetter" />
				<ToolbarItem 
					id="font-size-picker" 
					fontSize={fontSize} 
					setFontSize={setFontSize}
				/>
				<ToolbarItem id="toolbar-toggler" />
				<ToolbarItem id="speaker" speak={speak} setSpeak={setSpeak} />
			</header>
			<div id="deck" style={{fontSize: expand(fontSize)}}>
				{
					cardFronts.map((front, i) => 
						<Card 
							key={i} 
							observer={cardObserverRef.current}
							position={i+1} 
							frontContent={front}
							backContent={cardBacks[i]}
							speak={speak}
						/>
					)
				}
			</div>
			<button 
				id="card-index-display" 
				onClick={ e => e.currentTarget.classList.toggle("hide") }
			>
				1 of {cardFronts.length}
			</button>
		</div>
	);
}

//#endregion
//#region Private Functions
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

/** 
 * Return fontSizeAcronym from localStorage, otherwise return "M" if it's not 
 * there or an error ocurred 
*/
function getStoredFontSizeAcronym() {
	let result: string | null;
	try {
		result = window.localStorage.getItem("fontSizeAcronym");
	} catch /* SecurityError: localStorage is probably disabled */ {
		return "M";	
	}
	return ["XS","S","M","L","XL"].some(el => el === result) ? result : "M";
}

/** 
 * Return a font-size for the given acronym: 
 * "XS" to "x-small", "S" to "small", "M" to "medium", etc.
 * If the acronym is invalid then return "medium". 
*/
function expand(acronym: FontSizeAcronym) {
	const lookupTable: {[key: string]: string} = {
		XS: "x-small", S: "small", M: "medium", L: "large", XL: "x-large"
	};
	return lookupTable[acronym] ?? "medium";
}

//#endregion