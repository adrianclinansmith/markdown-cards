import FileUploadIcon from '@mui/icons-material/FileUpload';
import RefreshIcon from '@mui/icons-material/Refresh';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { ChangeEvent, Dispatch, SetStateAction } from "react";

interface Props {
	id: "uploader" | "refresher" | "toolbar-toggler" | "font-size-picker";
	setMd?: React.Dispatch<React.SetStateAction<string>>;
}

export default function ToolbarItem({ id, setMd }: Props) {
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
			<div className={className} id={id}>
				<span>one</span>
				<span>two</span>
				<span>three</span>
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
	console.log(`showToolbar: ${e.currentTarget}`);
	e.currentTarget.parentElement?.classList.toggle("hide");
	e.currentTarget.classList.toggle("prevent-hide");
}

