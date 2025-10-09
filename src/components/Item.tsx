import { Sprite, useTick } from "@pixi/react";
import { useState, useRef } from "react";
import useGameStore from "../store/useGameStore";

interface ItemProps {
  type: "candle" | "tomb";
  y: number;
}

export default function Item({ type, y }: ItemProps) {
  const { ghostY, addScore, setGameState } = useGameStore();
  const [x, setX] = useState(850);
  const [collected, setCollected] = useState(false);
  const speed = 5;
  const ref = useRef<any>(null);

  useTick(() => {
    if (collected) return;
    setX((prev) => {
      const newX = prev - speed;
      const ghostX = 100;
      const distX = Math.abs(newX - ghostX);
      const distY = Math.abs(y - ghostY);

      if (distX < 40 && distY < 40) {
        if (type === "candle") {
          addScore(1);
          setCollected(true);
        } else if (type === "tomb") {
          setGameState("over"); 
        }
      }
      return newX;
    });
  });

  if (collected || x < -100) return null;

  return (
    <Sprite
      ref={ref}
      image={type === "candle" ? "/candle.png" : "/tombstone.png"}
      x={x}
      y={y}
      width={type === "candle" ? 45 : 60}
      height={type === "candle" ? 45 : 60}
    />
  );
}
