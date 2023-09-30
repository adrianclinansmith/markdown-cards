import FileUploadIcon from '@mui/icons-material/FileUpload';
import RefreshIcon from '@mui/icons-material/Refresh';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef } from "react";
import { displayObserver, fontSizeMap, resetDeck, toggleToolbar } from "./utils.ts";

interface Props {
	id: "uploader" | "refresher" | "toolbar-toggler" | "font-size-picker";
	setMd?: Dispatch<SetStateAction<string>>;
	fontSize?: string;
	setFontSize?: Dispatch<SetStateAction<string>>;
}

export default function ToolbarItem({ id, setMd, fontSize, setFontSize }: Props) {
	const firstRenderRef = useRef(true);
	useEffect(() => {
		if (!firstRenderRef.current) {
			return;
		}
		firstRenderRef.current = false;
		if (id === "font-size-picker") {
			const observerCallback = (target: Element) => {
				storeFontSize(fontSizeMap[target.innerHTML]);
				setFontSize!(fontSizeMap[target.innerHTML]);
			};
			const observer = displayObserver(id, observerCallback);
			const fontSizePicker = document.getElementById(id)!;
			for (const pickerOption of fontSizePicker.children) {
				if (fontSizeMap[pickerOption.innerHTML] === fontSize) {
					pickerOption.scrollIntoView({behavior: "instant"});
				}
			}
			for (const pickerOption of fontSizePicker.children) {
				observer.observe(pickerOption);
			}
		}
	}, []);
	// JSX
	const className = "toolbar-item"
	if (id === "uploader") {
		return (
			<label className={className} id={id} htmlFor="file-input">
				<FileUploadIcon fontSize="large"/>
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
	else if (id === "refresher") {
		return (
			<button className={className} id={id} onClick={refresherOnClick}>
				<RefreshIcon fontSize="large"/>
			</button>
		)
	}
	else if (id === "font-size-picker") {
		return (
			<div className={className} id={id} ref={(el) => console.log(`ref for ${el?.className}`)}>
				<span>M</span>
				<span>L</span>
				<span>XL</span>
			</div>
		)
	}
	else /* className === toolbar-toggler */ {
		return (
			<button
				className={className}
				id={id}
				onClick={toolbarTogglerOnClick}
			>
				<KeyboardArrowUpIcon fontSize="large"/>
			</button>
		)
	}
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

function refresherOnClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
	const toolbar = e.currentTarget.parentElement!;
	toggleToolbar(e.currentTarget.parentElement!);
	resetDeck(toolbar.nextElementSibling as HTMLElement);
}

function toolbarTogglerOnClick(e: React.MouseEvent<HTMLButtonElement,
MouseEvent>) {
	toggleToolbar(e.currentTarget.parentElement!);
}

// *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
// Private Functions
// *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

function storeFontSize(fontSize: string) {
	/* Store fontSize in localStorage or log a message if it's unsuccessful */
	try {
		window.localStorage.setItem("fontSize", fontSize);
	} catch {
		console.log("Couldn't store font-size in browser: you've disabled local-storage or it's full.");
		return;
	}
}