import { useEffect, useRef } from "react";

// *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
// Types
// *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

export type FontSizeAcronym = "XS" | "S" | "M" | "L" | "XL";

// *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
// Custom Hooks
// *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

/** useEffect only on the first render */
export function useEffect_FirstRenderOnly(callback: ()=>void) {
	const firstRenderRef = useRef(true);
	useEffect(() => {
		if (firstRenderRef.current) {
			firstRenderRef.current = false;
			callback();
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
}

/** useEffect only when variable v updates (not on the initial render) */
export function useEffect_UpdateOnly(callback: (v:any)=>void, v: any) {
	const vRef = useRef(v);
	useEffect(() => {
		if (vRef.current !== v) {
			vRef.current = v;
			callback(v);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [v]);
}

// *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
// Observer Functions
// *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

/** 
 * A specialized IntersectionObserver: the callback fires with a single entry
 * when the target almost entirely intersects the root. This means the 
 * callback only fires when isIntersecting is true, and any subsequent entries 
 * get ignored. 
 */
export function displayObserver(
rootId: string, 
callback: (target: Element) => void
) {
	const options = {
		root: document.getElementById(rootId),
		rootMargin: "0px",
		threshold: 0.98,
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

export function resetDeck() {
	const deck = document.getElementById("deck")!;
	for (const card of deck.children) {
		card.classList.remove("flipped");
	}
	// deck.style.scrollSnapType = "none";
	deck.scrollTo({left: 0, behavior: "smooth"});
}

export function toggleToolbar() {
	const toolbar = document.getElementById("toolbar")!;
	const toolbarToggler = document.getElementById("toolbar-toggler")!;
	toolbar.classList.toggle("hide");
	toolbarToggler.classList.toggle("prevent-hide");
}