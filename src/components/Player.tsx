import { Sprite } from "@pixi/react";
import { useEffect, useState } from "react";

export default function Player() {
  const [y, setY] = useState(300); // 초기 위치
  const speed = 5;

  // 키보드 조작 (위아래만)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") setY((prev) => Math.max(0, prev - speed * 5));
      if (e.key === "ArrowDown") setY((prev) => Math.min(550, prev + speed * 5));
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // 마우스로도 위아래 이동
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setY(e.clientY - 100);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return <Sprite image="/ghost.png" x={150} y={y} scale={0.13} />;
}
