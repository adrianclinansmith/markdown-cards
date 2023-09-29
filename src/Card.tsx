import { PointerEvent, TransitionEvent, ReactElement } from "react";
import { reobserve } from "./utils";

interface Props {
	children: ReactElement[];
	position: number;
	observer: IntersectionObserver;
}

export default function Card({ children, position, observer }: Props) {
	return (
		<article 
			className="card" 
			id={`card-${position}`} 
			onPointerUp={cardPointerUp}
			onTransitionEnd={cardTransitionEnd} 
			ref={ (el) => el ? reobserve(observer, el) : null }
		>
			<section className="card-front">{children[0]}</section>
			<section className="card-back">{children[1]}</section>
		</article>	
	)
}

// *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
// Event Handlers
// *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

function cardPointerUp(e: PointerEvent<HTMLDivElement>) {
	const deck = e.currentTarget.parentElement!;
	/* Chrome: scroll-snap-type causes the next card to snap in and out
	when the current card is flipped */
	deck.style.scrollSnapType = "none"; 
	const card = e.currentTarget;
	card.classList.toggle("flipped");
}

function cardTransitionEnd(e: TransitionEvent<HTMLDivElement>) {
	const deck = (e.currentTarget as HTMLElement).parentElement!;
	deck.style.scrollSnapType = "";
}