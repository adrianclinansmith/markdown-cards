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
	console.log("render swiper");
    // hooks
    const ulRef = useRef<HTMLUListElement>(null);
	const liDisplayRefs = useRef<boolean[]>([]);
	// const [flip, setFlip] = useState(-1);
	while (liDisplayRefs.current.length < fronts.length) {
		const len = liDisplayRefs.current.length
		liDisplayRefs.current.push(len % 2 === 0);
	}
    const minOffsetXRef = useRef(0);
    const pointerDownXRef = useRef(0);
	const [offsetX, setOffsetX] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);
    // mouse events
    const onPointerMove = (e: PointerEvent) => {
        let mouseDiff = e.clientX - pointerDownXRef.current;
		const containerWidth = ulRef.current!.offsetWidth;
		const newOffsetX = -itemIndexRef.current * containerWidth + mouseDiff;
        setOffsetX(newOffsetX);
    };
    const onPointerUp = (e: PointerEvent) => {
        setIsSwiping(false);
        const ulWidth = ulRef.current!.offsetWidth;
        const mouseDiff = e.clientX - pointerDownXRef.current;
		// swipe right
        if (mouseDiff < -MIN_SWIPE_REQUIRED) {
			// itemIndexRef.current = Math.min(itemIndexRef.current + 1, Math.round(fronts.length / 2) - 1);
			itemIndexRef.current = Math.min(itemIndexRef.current + 1, fronts.length - 1);
        } // swipe left
		else if (mouseDiff > MIN_SWIPE_REQUIRED) {
			itemIndexRef.current = Math.max(itemIndexRef.current - 1, 0);
        } // flip current card 
		else {
			// let i = 2 * itemIndexRef.current;
			// liDisplayRefs.current[i] = !liDisplayRefs.current[i];
			// liDisplayRefs.current[i+1] = !liDisplayRefs.current[i+1];
			// setFlip(itemIndexRef.current);
		}
		console.log(liDisplayRefs.current);
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
			// 	<li 
			// 		className="swiper-item" 
			// 		key={index}
			// 		style={{
			// 			display: liDisplayRefs.current[index] ? "block" : "none"
			// 		}}
			// 	>
			// 		<Card style={{
			// 				height: "100vh", 
			// 				maxHeight:"1000px",
			// 				perspective: "1000px",
			// 				transform: index === flip ? "rotateY(180deg)" : "none"
			// 			}}
			// 		>
			// 			<CardContent style={{
			// 				transition: "transform 0.8s",
			// 				transformStyle: "preserve-3d",
			// 				transform: "rotateY(180deg)"
			// 			}}
			// 			>
			// 				<div className="card-front" style={{
			// 					position: "absolute",
			// 					width: "100%",
			// 					height: "100%",
			// 					backfaceVisibility: "hidden"
			// 				}}>
			// 					<ReactMarkdown 
			// 						children={front}
			// 						components={{code: MdCodeBlock}}
			// 						rehypePlugins={[rehypeKatex]}
			// 						remarkPlugins={[remarkGfm, remarkMath]}
			// 					/>
			// 				</div>
			// 				<div className="card-back" style={{
			// 					position: "absolute",
			// 					width: "100%",
			// 					height: "100%",
			// 					backfaceVisibility: "hidden",
			// 					transform: "rotateY(180deg)"
			// 				}}>
			// 					<ReactMarkdown 
			// 						children={backs[index]}
			// 						components={{code: MdCodeBlock}}
			// 						rehypePlugins={[rehypeKatex]}
			// 						remarkPlugins={[remarkGfm, remarkMath]}
			// 					/>
			// 				</div>
			// 			</CardContent>
			// 		</Card>
			//   </li>
			<li className="swiper-item" key={index}>
				<FlipItem index={index}>
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