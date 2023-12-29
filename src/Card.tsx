import { TransitionEvent } from "react";
import Md from "./Md";

interface Props {
	position: number;
	intersectionObserver: IntersectionObserver;
	// entirelyNotVisibleObserver: IntersectionObserver;
	frontContent: string;
	backContent:string;
	speak: boolean;
}

export default function Card({ position, intersectionObserver, frontContent, backContent, speak }: Props) {
	console.log("card render")
	return (
		<article 
			className="card" 
			id={`card-${position}`} 
			onClick={ (e) => cardClick(e, frontContent, backContent, speak) }
			onTransitionCancel={cardTransitionEndOrCancel} 
			onTransitionEnd={cardTransitionEndOrCancel} 
			ref={ (el) => refCallback(el, intersectionObserver) }
		>
			<section className="card-front"><Md>{frontContent}</Md></section>
			<section className="card-back"><Md>{backContent}</Md></section>
		</article>	
	)
}

// *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
// Event Handlers
// *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

/**
 * Flip the card and speak if the speaker is on
 */
function cardClick(e: React.MouseEvent<HTMLElement, MouseEvent>, frontContent: string, backContent: string, speak: boolean) { 
	const deck = e.currentTarget.parentElement!;
	deck.style.scrollSnapType = "none";
	const card = e.currentTarget;
	card.classList.toggle("flipped");
	if (!speak) {
		return;
	}
	/* Say what's on the card */
	let utterance = new SpeechSynthesisUtterance();
	if (card.classList.contains("flipped")) {
		utterance.text = backContent;
		utterance.lang = "zh-Hans"; // zh-Hans: simplified Chinese 
	}
	else {
		utterance.text = frontContent;
	}
	utterance.rate = 0.7;
	window.speechSynthesis.speak(utterance);
}

/**
 * Turn scroll-snap-type back on after the card has flipped
 */
function cardTransitionEndOrCancel(e: TransitionEvent<HTMLDivElement>) {
	const deck = e.currentTarget.parentElement!;
	deck.style.scrollSnapType = ""; // enable App.css scroll-snap-type
}

/**
 * Watch the card with an observer to know when it's on screen
 */
function refCallback(el: HTMLElement | null, intersectionObserver: IntersectionObserver) {
	if (el) {
		intersectionObserver.unobserve(el);
		intersectionObserver.observe(el);
	}
}