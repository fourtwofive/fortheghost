import { Stage } from "@pixi/react";
import { useEffect, useState, useMemo } from "react";
import Background from "./Background";
import Player from "./Player";
import Item from "./Item";
import useGameStore from "../store/useGameStore";

export default function GameStage() {
  const { addScore } = useGameStore();
  const [items, setItems] = useState<{ id: number; x: number; y: number }[]>([]);

  const speed = 4;
  const spawnInterval = 1500; // 1.5초마다 아이템 생성

  // ✅ 아이템 스폰 (배경 리렌더링 방지)
  useEffect(() => {
    const spawn = setInterval(() => {
      setItems((prev) => [
        ...prev,
        {
          id: Date.now(),
          x: 900 + Math.random() * 200,
          y: 100 + Math.random() * 400,
        },
      ]);
    }, spawnInterval);
    return () => clearInterval(spawn);
  }, []);

  // ✅ 아이템 이동
  useEffect(() => {
    const move = setInterval(() => {
      setItems((prev) =>
        prev
          .map((item) => ({
            ...item,
            x: item.x - speed,
          }))
          .filter((item) => item.x > -100)
      );
    }, 16);
    return () => clearInterval(move);
  }, []);

  // ✅ Background는 useMemo로 고정 → 렌더 중 새로 그리지 않음
  const background = useMemo(() => <Background />, []);

  return (
    <Stage width={800} height={600} options={{ backgroundColor: 0x1e1e1e }}>
      {background}
      <Player />
      {items.map((i) => (
        <Item key={i.id} x={i.x} y={i.y} onCollect={() => addScore(10)} />
      ))}
    </Stage>
  );
}
