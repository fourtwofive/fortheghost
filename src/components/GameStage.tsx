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

  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
  const baseWidth = 800;
  const baseHeight = 600;

  const spawnInterval = 1500;

  // 화면 크기 변경 감지해서 Stage 스케일 조정
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth * 0.9;
      const h = window.innerHeight * 0.8;
      const ratio = baseWidth / baseHeight;
      let newWidth = w;
      let newHeight = w / ratio;
      if (newHeight > h) {
        newHeight = h;
        newWidth = h * ratio;
      }
      setStageSize({ width: newWidth, height: newHeight });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 아이템 스폰 (게임 중일 때만)
  useEffect(() => {
    if (gameState !== "playing") return;
    setItems([]);
    const spawn = setInterval(() => {
      const type = Math.random() < 0.7 ? "candle" : "tomb";
      setItems((prev) => [
        ...prev,
        { id: Date.now(), y: 100 + Math.random() * 400, type },
      ]);
    }, spawnInterval);
    return () => clearInterval(spawn);
  }, [gameState]);

  const background = useMemo(() => <Background />, []);

  // 반응형 스케일 계산
  const scaleX = stageSize.width / baseWidth;
  const scaleY = stageSize.height / baseHeight;
  const scale = Math.min(scaleX, scaleY);

  const scoreTextStyle = useMemo(
    () =>
      new PIXI.TextStyle({
        fill: "#ffffff",
        fontSize: 32 * scale,
        fontFamily: "Press Start 2P, monospace",
        stroke: "#000000",
        strokeThickness: 4 * scale,
      }),
    [scale]
  );

  const overlay = (
    <Graphics
      draw={(g) => {
        g.clear();
        g.beginFill(0x000000, 0.6);
        g.drawRect(0, 0, stageSize.width / scale, stageSize.height / scale);
        g.endFill();
      }}

    />
  );

  // 스와이프 조작
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

  const textStyle = (color: string, size: number) =>
    new PIXI.TextStyle({
      fill: color,
      fontSize: size * scale,
      fontFamily: "Press Start 2P, monospace",
      align: "center",
      stroke: "#000000",
      strokeThickness: 3 * scale,
      lineJoin: "round"
    });

  return (
    <Container scale={scale}>
      {background}

      {/* 게임 중일 때만 아이템, 플레이어 표시 */}
      {gameState === "playing" &&
        items.map((i) => <Item key={i.id} type={i.type} y={i.y} />)}
      {gameState === "playing" && <Player />}

      {/* 점수 */}
      <Text text={`${score}`} x={700} y={20} style={scoreTextStyle} />

      {/* 게임 시작 화면 */}
      {gameState === "idle" && (
        <>
          {overlay}
          <Text
            text="Press Start"
            x={baseWidth / 2}
            y={baseHeight / 2 - 60}
            anchor={0.5}
            style={textStyle("#ffffff", 36)}
          />
          <Text
            text="▶ Click to Start"
            x={baseWidth / 2}
            y={baseHeight / 2 + 10}
            anchor={0.5}
            style={textStyle("#ffcc00", 24)}
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
            style={textStyle("#ff3333", 40)}
          />
          <Text
            text={`SCORE : ${score}`}
            x={baseWidth / 2}
            y={baseHeight / 2 - 20}
            anchor={0.5}
            style={textStyle("#ffffff", 24)}
          />
          <Text
            text="↻ RESTART"
            x={baseWidth / 2}
            y={baseHeight / 2 + 50}
            anchor={0.5}
            style={textStyle("#ffcc00", 28)}
            interactive
            cursor="pointer"
            pointerdown={() => reset()}
          />
        </>
      )}
    </Container>
  );
}
