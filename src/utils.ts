// *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
// Constants
// *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

export const fontSizeMap: {[key: string]: string} = {
	M: "medium", L: "large", XL: "x-large"
};

// *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
// Observer Functions
// *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

export function displayObserver(
rootId: string, 
callback: (target: Element) => void) {
	const options = {
		root: document.getElementById(rootId),
		rootMargin: "0px",
		threshold: 0.9,
	};
	const observerCallback: IntersectionObserverCallback = (entries) => {
		if (entries[0].isIntersecting) {
			callback(entries[0].target);
		}	
	};
	return new IntersectionObserver(observerCallback, options);
}

// *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
// DOM Manipulation Functions
// *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

export function resetDeck(deck: HTMLElement) {
	for (const card of deck.children) {
		card.classList.remove("flipped");
	}
	// deck.style.scrollSnapType = "none";
	deck.scrollTo({left: 0, behavior: "smooth"});
}

export function toggleToolbar(toolbar: HTMLElement) {
	const toolbarToggler = toolbar.children[toolbar.children.length - 1];
	toolbar.classList.toggle("hide");
	toolbarToggler.classList.toggle("prevent-hide");
}