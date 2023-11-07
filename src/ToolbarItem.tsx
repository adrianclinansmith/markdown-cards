// import FileUploadIcon from '@mui/icons-material/FileUpload';
// import UndoIcon from '@mui/icons-material/Undo';
// import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { displayObserver, fontSizeMap, resetDeck, toggleToolbar, useEffect_FirstRenderOnly } from "./utils.ts";

interface Props {
	id: "uploader" | "resetter" | "toolbar-toggler" | "font-size-picker";
	setMd?: Dispatch<SetStateAction<string>>;
	fontSize?: string;
	setFontSize?: Dispatch<SetStateAction<string>>;
}

export default function ToolbarItem({ id, setMd, fontSize, setFontSize }: Props) {
	// Effects
	useEffect_FirstRenderOnly(() => {
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
				{/* <UndoIcon color="action" fontSize="large"/> */}
				<SvgIcon item={id}/>
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
				onClick={toggleToolbar}
			>
				{/* <KeyboardArrowUpIcon color="action" fontSize="large"/> */}
				<SvgIcon item={id}/>
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

interface SvgIconProps {
	item: string;
}

function SvgIcon({ item }: SvgIconProps) {
	let d;
	if (item === "resetter") {
		d = "M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z";
	}
	else if (item === "uploader") {
		d = "M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z";
	}
	else if (item === "toolbar-toggler") {
		d = "M7.41 15.41 12 10.83l4.59 4.58L18 14l-6-6-6 6z";
	}
	const s: React.CSSProperties = { height: "100%", backgroundColor: "red"};
	return (
		<svg focusable="false" viewBox="0 0 24 24" style={s}>
			<path d={d} />
		</svg>
	)
}