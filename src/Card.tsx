import { TransitionEvent, ReactElement } from "react";
import Md from "./Md";

interface Props {
	position: number;
	observer: IntersectionObserver;
	frontContent: string;
	backContent:string;
}

export default function Card({ position, observer, frontContent, backContent }: Props) {
	console.log("card render")
	return (
		<article 
			className="card" 
			id={`card-${position}`} 
			onClick={cardClick}
			onTransitionEnd={cardTransitionEnd} 
			ref={ (el) => refCallback(el, observer) }
		>
			<section className="card-front"><Md>{frontContent}</Md></section>
			<section className="card-back"><Md>{backContent}</Md></section>
		</article>	
	)
}

// *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
// Event Handlers
// *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

function cardClick(e: React.MouseEvent<HTMLElement, MouseEvent>) {
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

function refCallback(el: HTMLElement | null, observer: IntersectionObserver) {
	if (el) {
		observer.unobserve(el);
		observer.observe(el);
	}
}