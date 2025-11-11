// src/components/GameStage.tsx
import { Text, Container, Graphics } from "@pixi/react";
import { useEffect, useState, useMemo } from "react";
import Background from "./Background";
import Player from "./Player";
import Item from "./Item";
import useGameStore from "../store/useGameStore";
import * as PIXI from "pixi.js";

export default function GameStage() {
  const { score, gameState, setGameState, reset, setDirection } = useGameStore();
  const [items, setItems] = useState<
    { id: number; y: number; type: "candle" | "tomb" }[]
  >([]);

  // 기준 해상도 (App에서 scale로 전체 조정)
  const baseWidth = 1920;
  const baseHeight = 1080;
  const spawnInterval = 1500;

  // 아이템 스폰 (게임 중일 때만)
  useEffect(() => {
    if (gameState !== "playing") return;
    setItems([]);
    const spawn = setInterval(() => {
      const type = Math.random() < 0.7 ? "candle" : "tomb";
      setItems((prev) => [
        ...prev,
        { id: Date.now(), y: 100 + Math.random() * 800, type },
      ]);
    }, spawnInterval);
    return () => clearInterval(spawn);
  }, [gameState]);

  const background = useMemo(() => <Background />, []);

  // Pixi 텍스트 스타일
  const scoreTextStyle = useMemo(
    () =>
      new PIXI.TextStyle({
        fill: "#ffffff",
        fontSize: 32,
        fontFamily: "Press Start 2P, chango",
        stroke: "#000000",
        strokeThickness: 4,
      }),
    []
  );

  const overlay = (
    <Graphics
      draw={(g) => {
        g.clear();
        g.beginFill(0x000000, 0.6);
        g.drawRect(0, 0, baseWidth, baseHeight);
        g.endFill();
      }}
    />
  );

  // 터치 스와이프 조작 (모바일 대응)
  useEffect(() => {
    let startY = 0;
    let lastDirection: "up" | "down" | null = null;

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      lastDirection = null;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0].clientY;
      const deltaY = currentY - startY;

      if (Math.abs(deltaY) < 10) {
        if (lastDirection !== null) {
          setDirection(null);
          lastDirection = null;
        }
        return;
      }

      if (deltaY < 0 && lastDirection !== "up") {
        setDirection("up");
        lastDirection = "up";
      }

      if (deltaY > 0 && lastDirection !== "down") {
        setDirection("down");
        lastDirection = "down";
      }
    };

    const handleTouchEnd = () => {
      setDirection(null);
      lastDirection = null;
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [setDirection]);

  // 텍스트 스타일 함수
  const textStyle = (color: string, size: number) =>
    new PIXI.TextStyle({
      fill: color,
      fontSize: size,
      fontFamily: "Press Start 2P, chango",
      align: "center",
      stroke: "#000000",
      strokeThickness: 3,
      lineJoin: "round",
    });

  return (
    <Container width={baseWidth} height={baseHeight}>
      {/* 배경 */}
      {background}

      {/* 게임 중일 때만 아이템, 플레이어 표시 */}
      {gameState === "playing" &&
        items.map((i) => <Item key={i.id} type={i.type} y={i.y} />)}
      {(gameState === "playing" || gameState === "dying") && <Player />}

      {/* 점수 표시 */}
      <Text text={`${score}`} x={1850} y={40} style={scoreTextStyle} />

      {/* 게임 시작 화면 */}
      {gameState === "idle" && (
        <>
          {overlay}
          <Text
            text="Press Start"
            x={baseWidth / 2}
            y={baseHeight / 2 - 60}
            anchor={0.5}
            style={textStyle("#ffffff", 80)}
          />
          <Text
            text="▶ Start"
            x={baseWidth / 2}
            y={baseHeight / 2 + 10}
            anchor={0.5}
            style={textStyle("#ffcc00", 50)}
            interactive
            cursor="pointer"
            pointerdown={() => setGameState("playing")}
          />
        </>
      )}

      {/* 게임 오버 화면 */}
      {gameState === "over" && (
        <>
          {overlay}
          <Text
            text="💀 GAME OVER 💀"
            x={baseWidth / 2}
            y={baseHeight / 2 - 80}
            anchor={0.5}
            style={textStyle("#ff3333", 80)}
          />
          <Text
            text={`SCORE : ${score}`}
            x={baseWidth / 2}
            y={baseHeight / 2 - 10}
            anchor={0.5}
            style={textStyle("#ffffff", 50)}
          />
          <Text
            text="↻ RESTART"
            x={baseWidth / 2}
            y={baseHeight / 2 + 50}
            anchor={0.5}
            style={textStyle("#ffcc00", 40)}
            interactive
            cursor="pointer"
            pointerdown={() => reset()}
          />
        </>
      )}
    </Container>
  );
}
