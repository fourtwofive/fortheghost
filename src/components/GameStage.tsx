import { Text, Container } from "@pixi/react";
import { useEffect, useState, useMemo } from "react";
import Background from "./Background";
import Player from "./Player";
import Item from "./Item";
import useGameStore from "../store/useGameStore";
import * as PIXI from "pixi.js";

export default function GameStage() {
  const { score } = useGameStore();
  const [items, setItems] = useState<{ id: number; y: number; type: "candle" | "tomb" }[]>([]);
  const spawnInterval = 1500;

  useEffect(() => {
    const spawn = setInterval(() => {
      const type = Math.random() < 0.7 ? "candle" : "tomb";
      setItems((prev) => [
        ...prev,
        { id: Date.now(), y: 100 + Math.random() * 400, type },
      ]);
    }, spawnInterval);
    return () => clearInterval(spawn);
  }, []);

  const background = useMemo(() => <Background />, []);

  const scoreTextStyle = useMemo(
    () =>
      new PIXI.TextStyle({
        fill: "#ffffff",
        fontSize: 32,
        fontFamily: "Press Start 2P, monospace",
        stroke: "#000000",
        strokeThickness: 4,
        dropShadow: true,
        dropShadowColor: "#000000",
        dropShadowBlur: 2,
        dropShadowDistance: 2,
      }),
    []
  );

  // ✅ 이제 Stage를 제거하고 Container만 반환
  return (
    <Container>
      {background}
      {items.map((i) => (
        <Item key={i.id} type={i.type} y={i.y} />
      ))}
      <Player />
      <Text text={`${score}`} x={700} y={20} style={scoreTextStyle} />
    </Container>
  );
}
