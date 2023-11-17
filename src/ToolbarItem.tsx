import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { displayObserver, resetDeck, toggleToolbar, useEffect_FirstRenderOnly, FontSizeAcronym } from "./utils.ts";

type ToolbarItemId = 
"uploader" | "resetter" | "toolbar-toggler" | "font-size-picker" | "speaker";

interface Props {
	id: ToolbarItemId;
	setMd?: Dispatch<SetStateAction<string>>;
	fontSize?: FontSizeAcronym;
	setFontSize?: Dispatch<SetStateAction<FontSizeAcronym>>;
}

export default function ToolbarItem({ id, setMd, fontSize, setFontSize }: Props) {
	// States
	const [speakerOn, setSpeakerOn] = useState(false);
	// Effects
	useEffect_FirstRenderOnly(() => {
		if (id === "font-size-picker") {
			const observerCallback = (target: Element) => {
				storeFontSizeAcronym(target.innerHTML);
				setFontSize!(target.innerHTML as FontSizeAcronym);
			};
			const observer = displayObserver(id, observerCallback);
			const fontSizePicker = document.getElementById(id)!;
			for (const pickerOption of fontSizePicker.children) {
				if (pickerOption.innerHTML === fontSize) {
					pickerOption.scrollIntoView({behavior: "instant"});
				}
			}
			for (const pickerOption of fontSizePicker.children) {
				observer.observe(pickerOption);
			}
		}
	});
	// JSX
	const className = "toolbar-item"
	if (id === "uploader") {
		return (
			<label className={className} id={id} htmlFor="file-input">
				<SvgIcon item={id}/>
				<input
					accept=".md,.txt"
					hidden
					id="file-input"
					onChange={(e) => uploaderOnChange(e, setMd!)}
					type="file"
				/>
			</label>
		)
	}
	else if (id === "resetter") {
		return (
			<button 
				className={className} 
				id={id} 
				onClick={ () => {toggleToolbar(); resetDeck();} }
			>
				<SvgIcon item={id}/>
			</button>
		)
	}
	else if (id === "font-size-picker") {
		return (
			<div className={className} id={id}>
				<div className="font-size-option">XS</div>
				<div className="font-size-option">S</div>
				<div className="font-size-option">M</div>
				<div className="font-size-option">L</div>
				<div className="font-size-option">XL</div>
			</div>
		)
	}
	else if (id === "toolbar-toggler") {
		return (
			<button
				className={className}
				id={id}
				onClick={toggleToolbar}
			>
				<SvgIcon item={id}/>
			</button>
		)
	}
	else {
		return (
			<button
				className={className}
				id={id}
				onClick={ () => {
					if (!speakerOn) {	
						const hello = ["你好", "Nǐ hǎo"]
						const lang = ["zh-Hans", "zh-Latn-pinyin"]
						const utterance = new SpeechSynthesisUtterance(hello[0]);
						utterance.lang = lang[0]
						window.speechSynthesis.speak(utterance);
					}
					setSpeakerOn(!speakerOn);
				}}
			>
				<SvgIcon item={id} on={speakerOn}/>
			</button>
		)
	}
}

// *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
// Private Components
// *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

interface SvgIconProps {
	item: ToolbarItemId;
	on?: boolean;
}

/**
 * Returns an SVG Icon taken from https://mui.com/material-ui/material-icons/
 */
function SvgIcon({ item, on }: SvgIconProps) {
	let SvgPath = <path d=""/>;
	if (item === "uploader") {
		SvgPath = <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/>;
	}
	else if (item === "resetter") {
		SvgPath = <path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/>;
	}
	else if (item === "toolbar-toggler") {
		SvgPath = <path d="M7.41 15.41 12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>;
	}
	else if (item === "speaker" && on) {
		SvgPath = <>
			<circle cx="9" cy="9" r="4"/>
			<path d="M9 15c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm7.76-9.64-1.68 1.69c.84 1.18.84 2.71 0 3.89l1.68 1.69c2.02-2.02 2.02-5.07 0-7.27zM20.07 2l-1.63 1.63c2.77 3.02 2.77 7.56 0 10.74L20.07 16c3.9-3.89 3.91-9.95 0-14z"/>
		</>;
	}
	else if (item === "speaker" && !on) {
		SvgPath = <path d="M12.99 9.18c0-.06.01-.12.01-.18 0-2.21-1.79-4-4-4-.06 0-.12.01-.18.01l4.17 4.17zm-6.1-3.56L4.27 3 3 4.27l2.62 2.62C5.23 7.5 5 8.22 5 9c0 2.21 1.79 4 4 4 .78 0 1.5-.23 2.11-.62L19.73 21 21 19.73l-8.62-8.62-5.49-5.49zM9 15c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm7.76-9.64-1.68 1.69c.84 1.18.84 2.71 0 3.89l1.68 1.69c2.02-2.02 2.02-5.07 0-7.27zM20.07 2l-1.63 1.63c2.77 3.02 2.77 7.56 0 10.74L20.07 16c3.9-3.89 3.91-9.95 0-14z"/>
	}
	return <svg focusable="false" viewBox="0 0 24 24">{SvgPath}</svg>;
}

// *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
// Event Handlers
// *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

function uploaderOnChange(e: ChangeEvent<HTMLInputElement>, 
setMd: Dispatch<SetStateAction<string>>) {
	const uploaderInput = e.currentTarget;
	const reader = new FileReader();
	reader.onload = () => {
		const md = reader.result as string;
		setMd(md);
	};
	if (uploaderInput.files?.length) {
		reader.readAsText(uploaderInput.files[0]);
	}
}

// *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
// Private Functions
// *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

/** 
 * Store fontSizeAcronym in localStorage or log a message if it's unsuccessful 
*/
function storeFontSizeAcronym(acronym: string) {
	try {
		window.localStorage.setItem("fontSizeAcronym", acronym);
	} catch {
		console.log("Couldn't store the font-size in your browser: local-storage is either full or disabled.");
		return;
	}
}