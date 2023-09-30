import { PointerEvent, TransitionEvent, ReactElement } from "react";

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
			ref={ (el) => refCallback(el, observer) }
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

function refCallback(el: HTMLElement | null, observer: IntersectionObserver) {
	if (el) {
		observer.unobserve(el);
		observer.observe(el);
	}
}