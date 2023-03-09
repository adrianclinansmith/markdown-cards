
import React, { useRef, useState } from 'react'
import "./Swiper.css"

type SwiperProps = {
	children: React.ReactElement[];
	didMoveRef: React.MutableRefObject<boolean>;
	indexRef: React.MutableRefObject<number>;
}

const MIN_SWIPE_REQUIRED = 40;

function Swiper({ children, didMoveRef, indexRef }: SwiperProps) {
    // hooks
    const ulRef = useRef<HTMLUListElement>(null);
    const minOffsetXRef = useRef(0);
    const pointerDownXRef = useRef(0);
	const [offsetX, setOffsetX] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);
    // mouse events
    const onPointerMove = (e: PointerEvent) => {
		console.log("on pointer move");
        let mouseDiff = e.clientX - pointerDownXRef.current;
		const containerWidth = ulRef.current!.offsetWidth;
		const newOffsetX = -indexRef.current * containerWidth + mouseDiff;
        didMoveRef.current = didMoveRef.current || Math.abs(mouseDiff) > 5;
		setOffsetX(newOffsetX);
    };
    const onPointerUp = (e: PointerEvent) => {
        setIsSwiping(false);
        const ulWidth = ulRef.current!.offsetWidth;
        const mouseDiff = e.clientX - pointerDownXRef.current;
		// swipe right
        if (mouseDiff < -MIN_SWIPE_REQUIRED) {
			indexRef.current = Math.min(indexRef.current + 1, children.length - 1);
        } // swipe left
		else if (mouseDiff > MIN_SWIPE_REQUIRED) {
			indexRef.current = Math.max(indexRef.current - 1, 0);
        } 
		const newOffsetX = -indexRef.current * ulWidth;
		setOffsetX(newOffsetX);
        window.removeEventListener('pointermove', onPointerMove);
		window.removeEventListener('pointerup', onPointerUp);
    };
    const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
		e.preventDefault();
        setIsSwiping(true);
        pointerDownXRef.current = e.clientX;
        const containerEl = ulRef.current;
        minOffsetXRef.current = containerEl!.offsetWidth - containerEl!.scrollWidth;
		didMoveRef.current = false;
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
    };
    return (
    <div className="swiper-container" onPointerDown={onPointerDown}>
        <ul 
            ref={ulRef}
            className={`swiper-list ${isSwiping ? 'is-swiping' : ''}`}
            style={{transform: `translate3d(${offsetX}px, 0, 0)`}}
        >
			{children.map((child, index) => 
				<li className="swiper-item" key={index}>
					{child}
				</li>
			)}
            {/* {fronts.map((front, index) => 
				<li className="swiper-item" key={index}>
					<FlipItem active={allowFlip.current} index={index}>
						<ReactMarkdown 
							children={front}
							components={{code: MdCodeBlock}}
							rehypePlugins={[rehypeKatex]}
							remarkPlugins={[remarkGfm, remarkMath]}
						/>
						<ReactMarkdown 
							children={backs[index]}
							components={{code: MdCodeBlock}}
							rehypePlugins={[rehypeKatex]}
							remarkPlugins={[remarkGfm, remarkMath]}
						/>
					</FlipItem>
				</li>
			)} */}
        </ul>
    </div>
    )
}

// Event Handlers

export default Swiper