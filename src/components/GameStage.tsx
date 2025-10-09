import { Text, Container, Graphics } from "@pixi/react";
import { useEffect, useState, useMemo } from "react";
import Background from "./Background";
import Player from "./Player";
import Item from "./Item";
import useGameStore from "../store/useGameStore";
import * as PIXI from "pixi.js";

export default function GameStage() {
  const { score, gameState, setGameState, reset } = useGameStore();
  const [items, setItems] = useState<
    { id: number; y: number; type: "candle" | "tomb" }[]
  >([]);

  const spawnInterval = 1500;

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

  const scoreTextStyle = useMemo(
    () =>
      new PIXI.TextStyle({
        fill: "#ffffff",
        fontSize: 32,
        fontFamily: "Press Start 2P, monospace",
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
        g.drawRect(0, 0, 800, 600);
        g.endFill();
      }}
    />
  );

  return (
    <Container>
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
            x={300}
            y={260}
            style={
              new PIXI.TextStyle({
                fill: "#ffffff",
                fontSize: 36,
                fontFamily: "Press Start 2P, monospace",
              })
            }
          />
          <Text
            text="▶ Click to Start"
            x={260}
            y={320}
            style={
              new PIXI.TextStyle({
                fill: "#ffcc00",
                fontSize: 24,
                fontFamily: "Press Start 2P, monospace",
              })
            }
            interactive
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
            x={220}
            y={240}
            style={
              new PIXI.TextStyle({
                fill: "#ff3333",
                fontSize: 40,
                fontFamily: "Press Start 2P, monospace",
              })
            }
          />
          <Text
            text={`SCORE: ${score}`}
            x={300}
            y={300}
            style={
              new PIXI.TextStyle({
                fill: "#ffffff",
                fontSize: 24,
                fontFamily: "Press Start 2P, monospace",
              })
            }
          />
          <Text
            text="↻ RESTART"
            x={310}
            y={360}
            style={
              new PIXI.TextStyle({
                fill: "#ffcc00",
                fontSize: 28,
                fontFamily: "Press Start 2P, monospace",
              })
            }
            interactive
            pointerdown={() => reset()}
          />
        </>
      )}
    </Container>
  );
}
