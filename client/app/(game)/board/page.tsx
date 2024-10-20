'use client'
import useResolve from "@/components/hocks/useResolve";
import Opponent from "@/components/game/opponent";

import Player from "@/components/game/player";
import { useGameStore } from "@/components/state/store";
import { useWindowSize } from "@uidotdev/usehooks";
import { useMemo } from "react";


export default function BlogPage() {
  useResolve();
  const shouldResolve = useGameStore((state) => state.shouldReolve);
  const cordinates = locations();
  const memoizedCordinates = useMemo(()=> cordinates,[]);
  return (
    <div style={{backgroundImage:' radial-gradient(ellipse at center 40%, #008d00 0, #000000 100%)'}} className=" h-full">
      <Player cordinates={cordinates} resolveTo={shouldResolve} />
      <Opponent key={2}  id={2} resolveTo={shouldResolve} />
      <Opponent key={3} id={3} resolveTo={shouldResolve} />
      <Opponent key={4} id={4} resolveTo={shouldResolve} />
    </div>
  );
}

const locations = ():[number,number] => {
  const { width, height } = useWindowSize();
  if(width && height){
    const middle = [width/2,height/2] as [number,number];
    console.log(middle);
    return middle;
  }else return [0,0]

}