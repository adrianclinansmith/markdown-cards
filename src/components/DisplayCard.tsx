import Card from "@mui/material/Card";

export default function DisplayCard() {
    return (
	<Card 
        onPointerDown={e => pointerDown(e, index, setIndex)}
        onPointerMove={e => pointerMove(e, index, setIndex, setLeftPosition)}
        onPointerUp={e => pointerUp(e, index, setIndex)}
        sx={{position: "relative", left: `${leftPosition}px`}}
    >
    </Card>
	)
}