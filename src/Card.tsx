import { TransitionEvent } from "react";
import Md from "./Md";

interface Props {
	position: number;
	observer: IntersectionObserver;
	frontContent: string;
	backContent:string;
	speak: boolean;
}

export default function Card({ position, observer, frontContent, backContent, speak }: Props) {
	console.log("card render")
	return (
		<article 
			className="card" 
			id={`card-${position}`} 
			onClick={ (e) => cardClick(e, frontContent, backContent, speak) }
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

/**
 * Flip the card and speak it's content if speak is turned on
 */
function cardClick(e: React.MouseEvent<HTMLElement, MouseEvent>, frontContent: string, backContent: string, speak: boolean) {
	const deck = e.currentTarget.parentElement!;
	/* For Chrome: scroll-snap-type must be disabled when card flips */
	deck.style.scrollSnapType = "none"; 
	const card = e.currentTarget;
	card.classList.toggle("flipped");
	if (!speak) {
		return;
	}
	/* Say what's on the card */
	let utterance: SpeechSynthesisUtterance;
	if (card.classList.contains("flipped")) {
		utterance = new SpeechSynthesisUtterance(backContent);
		utterance.lang = "zh-Hans"; // "zh-Hans" is simplified Chinese 
		// "zh-Hans-Latn" should be for Hanyu Pinyin, but it doesn't work
	}
	else {
		utterance = new SpeechSynthesisUtterance(frontContent);
	}
	window.speechSynthesis.speak(utterance);
}

/**
 * Turn scroll-snap-type back on after the card has flipped
 */
function cardTransitionEnd(e: TransitionEvent<HTMLDivElement>) {
	const deck = e.currentTarget.parentElement!;
	deck.style.scrollSnapType = ""; // enable App.css scroll-snap-type
}

/**
 * Watch the card with an observer to know when it's on screen
 */
function refCallback(el: HTMLElement | null, observer: IntersectionObserver) {
	if (el) {
		observer.unobserve(el);
		observer.observe(el);
	}
}