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
	
export function reobserve(observer: IntersectionObserver, element: Element) {
	observer.unobserve(element);
	observer.observe(element);
}