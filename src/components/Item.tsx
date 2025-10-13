import { Sprite, useTick } from "@pixi/react";
import { useState, useRef } from "react";
import useGameStore from "../store/useGameStore";

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

  // 실제 시각적 크기
  const width = type === "candle" ? 150 : 350;
  const height = type === "candle" ? 170 : 370;

  useTick(() => {
    if (gameState !== "playing" || collected) return;

    setX((prev) => {
      const newX = prev - speed;

      // 고스트 위치 기준값 (Player 컴포넌트의 x=300, width=300, height=400 기준)
      const ghostX = 300;
      const ghostWidth = 300;
      const ghostHeight = 400;

      // AABB(사각형 충돌) 검사
      const ghostLeft = ghostX - ghostWidth / 2;
      const ghostRight = ghostX + ghostWidth / 2;
      const ghostTop = ghostY - ghostHeight / 2;
      const ghostBottom = ghostY + ghostHeight / 2;

      const itemLeft = newX - width / 2;
      const itemRight = newX + width / 2;
      const itemTop = y - height / 2;
      const itemBottom = y + height / 2;

      const isColliding =
        ghostRight > itemLeft &&
        ghostLeft < itemRight &&
        ghostBottom > itemTop &&
        ghostTop < itemBottom;

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
