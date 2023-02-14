import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Dispatch, ReactNode, useState } from "react";

type DisplayCardProps = {
	children: ReactNode,
	index: number,
	setIndex: Dispatch<React.SetStateAction<number>>
};

export default function DisplayCard({ children, index, setIndex }: DisplayCardProps) {
	const [leftPosition, setLeftPosition] = useState(0);
    return (
		<Card 
			onPointerDown={e => pointerDown(e, index, setIndex)}
			onPointerMove={e => pointerMove(e, index, setIndex, setLeftPosition)}
			onPointerUp={e => pointerUp(e, index, setIndex)}
			sx={{position: "relative", left: `${leftPosition}px`}}
		>
			<CardContent>
				{children}
			</CardContent>
		</Card>
	)
}

// *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
// Helper Functions
// *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

let pointerStart = 0;
let pointerIsDown = false;

function pointerDown(e: React.PointerEvent<HTMLDivElement>, index: number, setIndex: React.Dispatch<React.SetStateAction<number>>) {
	pointerIsDown = true;
	pointerStart = e.clientX;
	console.log(`pointerDown (${e.clientX}, ${e.clientY})`);
}

function pointerMove(e: React.PointerEvent<HTMLDivElement>, index: number, setIndex: React.Dispatch<React.SetStateAction<number>>, setLeftPosition: React.Dispatch<React.SetStateAction<number>>) {
	if (!pointerIsDown) {
		return;
	}
	setLeftPosition(e.clientX - pointerStart);
	console.log(`pointerMove (${e.clientX}, ${e.clientY})`);
}

function pointerUp(e: React.PointerEvent<HTMLDivElement>, index: number, setIndex: React.Dispatch<React.SetStateAction<number>>) {
	pointerIsDown = false;
	setIndex(index + (index % 2 === 0 ? 1 : -1));
	console.log(`pointerUp (${e.clientX}, ${e.clientY})`);
}