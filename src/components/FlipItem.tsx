import React from 'react'
import "./FlipItem.css"

type FlipItemProps = {
	active: boolean;
	children: React.ReactElement[];
	index: number;
};

function FlipItem({active, children, index}: FlipItemProps) {
	// console.log("flip item render");
	const onPointerUp = () => {
		console.log(`flip active: ${active}`);
		if (active) {
			document.querySelector(`#myCard-${index}`)?.classList.toggle("flip");
		}
		
	}
	return (
	<div className="flip-card" 
		id={`myCard-${index}`} 
		onPointerUp={onPointerUp}
	>
		<div className="flip-card-inner">
			<div className="flip-card-front">
				{children[0]}
			</div>
			<div className="flip-card-back">
				{children[1]}
			</div>
		</div>
	</div>
  )
}

export default FlipItem