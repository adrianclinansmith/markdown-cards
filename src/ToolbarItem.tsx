import FileUploadIcon from '@mui/icons-material/FileUpload';
import RefreshIcon from '@mui/icons-material/Refresh';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { ChangeEvent, Dispatch, PointerEventHandler, SetStateAction, useEffect, useRef, useState } from "react";

interface Props {
	id: "uploader" | "refresher" | "toolbar-toggler" | "font-size-picker";
	setMd?: React.Dispatch<React.SetStateAction<string>>;
}

export default function ToolbarItem({ id, setMd }: Props) {
	const options = {
		root: document.getElementById("font-size-picker"),
		rootMargin: "0px",
		threshold: 0.9,
	};
	const callback: IntersectionObserverCallback = (entries) => {
		if (entries[0].isIntersecting) {
			console.log(`${entries[0].target.innerHTML} entered threshold`);
		}
		
	}
	const observerRef = useRef(new IntersectionObserver(callback, options));
	const mediumFontRef = useRef(null);
	const largeFontRef = useRef(null);
	const xLargeFontRef = useRef(null);
	useEffect(() => {
		if (id === "font-size-picker") {
			reobserve(observerRef.current, mediumFontRef.current!);
			reobserve(observerRef.current, largeFontRef.current!);
			reobserve(observerRef.current, xLargeFontRef.current!);
		}
	}, [id]);
	
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
					onChange={(e) => readFile(e, setMd!)}
					type="file"
				/>
			</label>
		)
	}
	else if (id === "refresher") {
		return (
			<button className={className} id={id} onClick={refreshCards}>
				<RefreshIcon fontSize="large"/>
			</button>
		)
	}
	else if (id === "font-size-picker") {
		return (
			<div 
				className={className} 
				id={id} 
				// onScroll={fontSizePickerScroll} 
			>
				<span ref={mediumFontRef}>M</span>
				<span ref={largeFontRef}>L</span>
				<span ref={xLargeFontRef}>XL</span>
			</div>
		)
	}
	else /* className === toolbar-toggler */ {
		return (
			<button className={className} id={id} onClick={showToolbar}>
				<KeyboardArrowUpIcon fontSize="large"/>
			</button>
		)
	}
}

// *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
// Event Handlers
// *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

// function fontSizePickerScroll(e: React.UIEvent<HTMLDivElement>) {
// 	const fontSizePicker = e.currentTarget;
// 	let isScrolling = fontSizePicker.classList.contains("is-scrolling");
// 	if (!isScrolling) {
// 		fontSizePicker.classList.add("is-scrolling");
// 		setTimeout(() => {
// 			fontSizePicker.classList.remove("is-scrolling");
// 			console.log("is scrolling");
// 		}, 1000);
// 	}
// }

function readFile(e: ChangeEvent<HTMLInputElement>, 
setMd: Dispatch<SetStateAction<string>>) {
	const reader = new FileReader();
	reader.onload = () => {
		const md = reader.result as string;
		setMd(md);
	};
	if (e.target?.files?.length) {
		reader.readAsText(e.target.files[0]);
	}
}

function refreshCards(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
	const toolbar = e.currentTarget.parentElement!;
	const deck = toolbar.nextElementSibling!; 
	toolbar.classList.add("hide");
	toolbar.children[toolbar.children.length - 1].classList.add("prevent-hide");
	for (const card of deck.children) {
		card.classList.remove("flipped");
	}
	// deck.style.scrollSnapType = "none";
	deck.scrollTo({left: 0, behavior: "smooth"});
}

function showToolbar(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
	e.currentTarget.parentElement?.classList.toggle("hide");
	e.currentTarget.classList.toggle("prevent-hide");
}

// *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
// Helper Functions
// *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

function reobserve(observer: IntersectionObserver, element: HTMLElement) {
	observer.unobserve(element);
	observer.observe(element);
}
