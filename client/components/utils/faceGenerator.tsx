import { Card, Rank, Suit } from "@/types";
import styles from './cards.module.css';
import localFont from 'next/font/local';

const myFont = localFont({
    src: '../../config/cards21.ttf',
    display: 'swap',
});

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}

export const FaceGenerator = (card: Card | null) => {

    if (!card) return <></>;

    const positions = {
        '2': [[14, 50], [86, 50]],
        '3': [[14, 50], [50, 50], [86, 50]],
        '4': [[14, 20], [14, 80], [86, 20], [86, 80]],
        '5': [[14, 20], [14, 80], [50, 50], [86, 20], [86, 80]],
        '6': [[14, 20], [14, 80], [50, 20], [50, 80], [86, 20], [86, 80]],
        '7': [[14, 20], [14, 80], [32, 50], [50, 20], [50, 80], [86, 20], [86, 80]],
        '8': [[14, 20], [14, 80], [32, 50], [50, 20], [50, 80], [68, 50], [86, 20], [86, 80]],
        '9': [[14, 20], [14, 80], [38, 20], [38, 80], [50, 50], [62, 20], [62, 80], [86, 20], [86, 80]],
        '10': [[14, 20], [14, 80], [26, 50], [38, 20], [38, 80], [62, 20], [62, 80], [74, 50], [86, 20], [86, 80]]
    };


    const { rank, suit } = card;
    const transformRankValue = (rank: Rank) => {
        switch (rank) {
            case Rank.Ace:
                return 'A'
            case Rank.Queen:
                return 'Q'
            case Rank.King:
                return 'K'
            case Rank.Jack:
                return 'J'
            default:
                return rank
        }
    };
    const transformSuitValue = (suit: Suit) => {
        switch (suit) {
            case Suit.Clubs:
                return "c"
            case Suit.Diamonds:
                return 'd'
            case Suit.Hearts:
                return 'h'
            case Suit.Spades:
                return 's'
        }
    };
    const shouldRotateSuit = (A: number[][], i: number) => {
        switch (A.length) {
            case 6:
                return i > 3;
            case 7:
                return i > 4;
            case 8:
                return i > 4;
            default:
                if (A.length % 2 === 0) {
                    return i > A.length / 2 - 1;

                } else {
                    return i > A.length / 2 + 0.5;

                }
        }
    };
    const transformedRank = transformRankValue(rank);
    const transformedSuit = transformSuitValue(suit);
    const frameGenerator = (card: Card) => {
        if (isNaN(+card.rank)) {
            return <div style={{ backgroundImage: `url(/images/${card.rank[0] + card.suit[0]}.png)` }} className={classNames('', 'absolute w-[60%] h-[74%] left-[20%] top-[13%] p-[1px] leading-[20px] bg-center bg-no-repeat bg-cover ')} />;
        } else {
            return <div className={classNames(suit === Suit.Clubs || suit === Suit.Spades ? 'text-black' : 'text-red-600', `w-[60%] h-[74%] left-[20%] top-[13%] p-[1px] leading-[20px] absolute ${myFont.className}`)}>
                {positions[card.rank as keyof typeof positions].map((position, i, a) => {
                    return <span style={{ top: `${position[0]}%`, left: `${position[1]}%` }} className={classNames(shouldRotateSuit(a, i) ? 'rotate-180' : '', 'absolute translate-x-[-50%] translate-y-[-50%]')} >
                        {transformedSuit}
                    </span>
                })
                }
            </div >
        }
    }
    const frame = frameGenerator(card);
    return (
        <>
            {/* <span className={`${styles.rank1} text-${themeColor} text-[28px] `}>{transformedRank}</span> */}
            <span className={classNames(suit === Suit.Clubs || suit === Suit.Spades ? 'text-black' : 'text-red-600', `${styles.rank1} text-[28px]`)}>{transformedRank}</span>
            <span className={classNames(suit === Suit.Clubs || suit === Suit.Spades ? 'text-black' : 'text-red-600', `${styles.rank2} text-[28px]`)}>{transformedRank}</span>
            <span className={classNames(suit === Suit.Clubs || suit === Suit.Spades ? 'text-black' : 'text-red-600', `${myFont.className} ${styles.suit1} `)}>{transformedSuit}</span>
            <span className={classNames(suit === Suit.Clubs || suit === Suit.Spades ? 'text-black' : 'text-red-600', `${myFont.className} ${styles.suit2} `)}>{transformedSuit}</span>
            {frame}
            {/* <div style={{ backgroundImage: `url(/images/${card.rank[0] + card.suit[0]}.png)` }} className={classNames(suit === Suit.Clubs || suit === Suit.Spades ? 'shadow-[inset_0_0_0_1px_#333]' : 'shadow-[inset_0_0_0_1px_#d00]', 'absolute w-[60%] h-[74%] left-[20%] top-[13%] p-[1px] leading-[20px] bg-center bg-no-repeat bg-cover ')} /> */}
        </>
    )
}