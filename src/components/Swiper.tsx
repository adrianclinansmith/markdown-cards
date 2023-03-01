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

type SwiperProps = {
    items: string[];
	itemIndexRef: React.MutableRefObject<number>;
}

const MIN_SWIPE_REQUIRED = 40;

function Swiper({ items, itemIndexRef }: SwiperProps) {
    // hooks
    const ulRef = useRef<HTMLUListElement>(null);
    const pointerDownOffsetXRef = useRef(0);
	const currentOffsetXRef = useRef(0);
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
		currentOffsetXRef.current = newOffsetX;
    };
    const onPointerUp = () => {
        setIsSwiping(false);
        const mouseDownOffsetX = pointerDownOffsetXRef.current;
		const currentOffsetX = currentOffsetXRef.current;
        const containerEl = ulRef.current;
        const containerWidth = containerEl!.offsetWidth;
        const diff = mouseDownOffsetX - currentOffsetX;
        if (diff > MIN_SWIPE_REQUIRED) {
			itemIndexRef.current = Math.min(itemIndexRef.current + 1, items.length - 1);
        } else if (diff < -MIN_SWIPE_REQUIRED) {
			itemIndexRef.current = Math.max(itemIndexRef.current - 1, 0);
        }
		const newOffsetX = -itemIndexRef.current * containerWidth;
		setOffsetX(newOffsetX);
		currentOffsetXRef.current = newOffsetX;
        window.removeEventListener('pointermove', onPointerMove);
		window.removeEventListener('pointerup', onPointerUp);
    };
    const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
		e.preventDefault();
        setIsSwiping(true);
		pointerDownOffsetXRef.current = offsetX;
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
            {items.map((item, index) => 
				<li className="swiper-item" key={index}>
					<Card style={{height: "100vh", maxHeight:"1000px"}}>
						<CardContent>
							<ReactMarkdown 
								children={item}
								components={{code: MdCodeBlock}}
								rehypePlugins={[rehypeKatex]}
								remarkPlugins={[remarkGfm, remarkMath]}
							/>
						</CardContent>
					</Card>
			  </li>
			)}
        </ul>
    </div>
    )
}

// Event Handlers

export default Swiper