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

type SwiperProps = {
    items: string[];
}

const MIN_SWIPE_REQUIRED = 40;

function Swiper({ items }: SwiperProps) {
    // hooks
    const containerRef = useRef<HTMLUListElement>(null);
    const mouseDownOffsetXRef = useRef(0);
	const currentOffsetXRef = useRef(0);
    const minOffsetXRef = useRef(0);
    const mouseDownXRef = useRef(0);
	const [offsetX, setOffsetX] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);
    // mouse events
    const onMouseMove = (e: PointerEvent) => {
        const mouseDiff = mouseDownXRef.current - e.clientX;
        let newOffsetX = mouseDownOffsetXRef.current - mouseDiff;
        const maxOffsetX = 0;
        const minOffsetX = minOffsetXRef.current;
        if (newOffsetX > maxOffsetX) {
            newOffsetX = maxOffsetX;
        }
        if (newOffsetX < minOffsetX) {
            newOffsetX = minOffsetX;
        }
        setOffsetX(newOffsetX);
		currentOffsetXRef.current = newOffsetX;
    };
    const onMouseUp = () => {
        setIsSwiping(false);
        const currentOffsetX = mouseDownOffsetXRef.current;
		let newOffsetX = currentOffsetXRef.current;
        const containerEl = containerRef.current;
        const containerWidth = containerEl!.offsetWidth;
        const diff = currentOffsetX - newOffsetX;
		console.log(`diff: ${diff}`);
        if (diff > MIN_SWIPE_REQUIRED) {
            newOffsetX = Math.floor(newOffsetX / containerWidth) * containerWidth;
        } else if (diff < -MIN_SWIPE_REQUIRED) {
            newOffsetX = Math.ceil(newOffsetX / containerWidth) * containerWidth;
        } else {
            newOffsetX = Math.round(newOffsetX / containerWidth) * containerWidth;
        }
        setOffsetX(newOffsetX);
		currentOffsetXRef.current = newOffsetX;
        window.removeEventListener('pointerup', onMouseUp);
        window.removeEventListener('pointermove', onMouseMove);
    };
    const onMouseDown = (e: React.PointerEvent<HTMLDivElement>) => {
        setIsSwiping(true);
		mouseDownOffsetXRef.current = offsetX;
        mouseDownXRef.current = e.clientX;
        const containerEl = containerRef.current;
        minOffsetXRef.current = containerEl!.offsetWidth - containerEl!.scrollWidth;
        window.addEventListener('pointermove', onMouseMove);
        window.addEventListener('pointerup', onMouseUp);
    };
    return (
    <div className="swiper-container" onPointerDown={onMouseDown}>
        <ul 
            ref={containerRef}
            className={`swiper-list ${isSwiping ? 'is-swiping' : ''}`}
            style={{transform: `translate3d(${offsetX}px, 0, 0)`}}
        >
            {items.map((item, index) => 
				<li className="swiper-item" key={index}>
					<Card>
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

export default Swiper