import { Card, CardContent } from "@mui/material";
import React from 'react';
import { SwiperItemType } from "../types";

import './SwiperItem.css';


function SwiperItem({item}: SwiperItemType) {
  return (
    <li className="swiper-item">
      {/* <img 
        src={imageSrc} 
        alt={imageAlt} 
        className="swiper-img"
        draggable={false} 
      /> */}
		<Card>
			<CardContent>
				{item}
			</CardContent>
		</Card>
    </li>
  );
}

export default SwiperItem;