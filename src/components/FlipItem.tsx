import React from 'react'
import "./styles/FlipItem.css"

type FlipItemProps = {
	children: React.ReactElement[];
	disabled: React.MutableRefObject<boolean>;
	index: number;
};

function FlipItem({children, disabled, index}: FlipItemProps) {
	// console.log("flip item render");
	const onPointerUp = () => {
		console.log(`flip disabled: ${disabled.current}`);
		if (!disabled.current) {
			const element = document.querySelector(`#flip-card-${index}`);
			element?.classList.toggle("flip");
		}
		
	}
	return (
	<div className="flip-card" 
		id={`flip-card-${index}`} 
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