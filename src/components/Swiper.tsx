import { CardContent } from "@mui/material";
import Card from "@mui/material/Card";
import React, { useRef, useState } from 'react'
import { SwiperItemType } from "../types";

import "./Swiper.css"
import './SwiperItem.css';
import SwiperItem from "./SwiperItem";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import MdCodeBlock from "./MdCodeBlock";
import { maxHeight } from "@mui/system";
import FlipItem from "./FlipItem";

type SwiperProps = {
    items: string[];
	fronts: string[];
	backs: string[];
	itemIndexRef: React.MutableRefObject<number>;
}

const MIN_SWIPE_REQUIRED = 40;

function Swiper({ items, fronts, backs, itemIndexRef }: SwiperProps) {
	// console.log("render swiper");
    // hooks
    const ulRef = useRef<HTMLUListElement>(null);
	// const [allowFlip, setAllowFlip] = useState(true);
	const allowFlip = useRef(true);
    const minOffsetXRef = useRef(0);
    const pointerDownXRef = useRef(0);
	const [offsetX, setOffsetX] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);
    // mouse events
    const onPointerMove = (e: PointerEvent) => {
		console.log("on pointer move");
        let mouseDiff = e.clientX - pointerDownXRef.current;
		const containerWidth = ulRef.current!.offsetWidth;
		const newOffsetX = -itemIndexRef.current * containerWidth + mouseDiff;
        allowFlip.current = allowFlip.current && Math.abs(mouseDiff) < 5;
		setOffsetX(newOffsetX);
    };
    const onPointerUp = (e: PointerEvent) => {
        setIsSwiping(false);
        const ulWidth = ulRef.current!.offsetWidth;
        const mouseDiff = e.clientX - pointerDownXRef.current;
		// swipe right
        if (mouseDiff < -MIN_SWIPE_REQUIRED) {
			itemIndexRef.current = Math.min(itemIndexRef.current + 1, fronts.length - 1);
        } // swipe left
		else if (mouseDiff > MIN_SWIPE_REQUIRED) {
			itemIndexRef.current = Math.max(itemIndexRef.current - 1, 0);
        } 
		const newOffsetX = -itemIndexRef.current * ulWidth;
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
		// setAllowFlip(true);
		allowFlip.current = true;
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
            {fronts.map((front, index) => 
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
			)}
        </ul>
    </div>
    )
}

// Event Handlers

export default Swiper