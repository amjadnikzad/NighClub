'use client'
import { MouseEvent } from "react";
import { FaceGenerator } from "./utils/faceGenerator";
import '../public/denim.png';

import styles from './card.module.css';
import { CardWithIndex } from "@/types";
import { classNames } from "./utils/styling";
import { getScaleForLocation } from "./utils/card";

enum Locations {
    Deck = "Deck",
    Hand = "Hand",
    Stack = "Stack",
}



type CardTemplateProps = {
    card: CardWithIndex,
    loactaion: [[number, number], Locations],
    flipped: boolean,
    ownedByPlayer: boolean,
    clickHandler: (key: CardWithIndex) => void,
    rotation: number,
    cardIndex: number,
};

export default function CardTemplate(props: CardTemplateProps) {

    const loaction = props.loactaion[0];
    const semanticLocation = props.loactaion[1];
    const handleClick = (e: MouseEvent) => {
        e.preventDefault();
        if (!props.card) return;
        props.clickHandler(props.card);

    };
    const cardFront = 'h-full text-[32px]  w-full absolute backface-hidden leading-[30px] bg-white border-black border-[1px] rounded-[9px]';
    const cardBack = "back-art absolute w-[128px] bg-center left-[5px] top-[5px] h-[178px] bg-black bg-no-repeat bg-cover rounded-[5px] bg-[url('../public/denim.png')]"
    const face = props.card ? FaceGenerator(props.card?.card) : FaceGenerator(null);
    return (
        <>
            <div onClick={handleClick} style={{ transform: `translate(-50%, -50%) translate(${loaction[0]}px, ${loaction[1]}px)  translateZ(0)  rotate(${props.rotation}deg)`, perspective: '1000px', scale: `${getScaleForLocation(semanticLocation, props.ownedByPlayer)}` }} className={classNames(props.ownedByPlayer ? '' : 'pointer-events-none',semanticLocation !== 'Hand' ? 'pointer-events-none' : '', 'card element  transition-all duration-300 ease-in hover:-top-20   absolute block h-[190px] w-[140px] select-none bg-transparent top-0   ')}>
                <div style={{ transformStyle: 'preserve-3d' }} className={`wrapper transition-all duration-300 h-full w-full relative ${styles.theCard}`}>
                    <div className={` h-full absolute backface-hidden w-full bg-white border-black border-[1px] rounded-[9px]`}>
                        <div className={cardBack} />
                    </div>
                    <div className={classNames(props.flipped ? styles.rotate : '', cardFront)}>
                        {face}
                    </div>

                </div>
            </div>
        </>
    );
};




