import { Sprite, useTick } from "@pixi/react";
import { useState, useRef } from "react";
import useGameStore from "../store/useGameStore";
import { checkCollision } from "../utils/collision";

interface ItemProps {
  type: "candle" | "tomb";
  y: number;
}

export default function Item({ type, y }: ItemProps) {
  const { ghostY, addScore, setGameState, gameState } = useGameStore();
  const [x, setX] = useState(2400);
  const [collected, setCollected] = useState(false);
  const speed = 8;
  const ref = useRef<any>(null);

  const width = type === "candle" ? 120 : 310;
  const height = type === "candle" ? 170 : 370;

  useTick(() => {
    if (gameState !== "playing" || collected) return;

    setX((prev) => {
      const newX = prev - speed;

      const isColliding = checkCollision(
        300,        // ghostX (고정)
        ghostY,     // ghostY (실시간)
        300,        // ghostWidth
        400,        // ghostHeight
        newX,       // itemX
        y,          // itemY
        width,
        height,
        0.7,        // ghost hitbox scale
        0.6         // item hitbox scale
      );

      if (isColliding) {
        if (type === "candle") {
          addScore(1);
          setCollected(true);
        } else if (type === "tomb") {
          setGameState("dying");
        }
      }

      return newX;
    });
  });

  if (collected || x < -400) return null;

  return (
    <Sprite
      ref={ref}
      image={type === "candle" ? "/candle.png" : "/tombstone.png"}
      x={x}
      y={y}
      width={width}
      height={height}
      anchor={0.5}
    />
  );
}
