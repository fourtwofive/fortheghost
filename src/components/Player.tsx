import { Sprite } from "@pixi/react";
import * as PIXI from "pixi.js";
import { useEffect } from "react";
import useGameStore from "../store/useGameStore";

export default function Player() {
  const { ghostY, moveGhost } = useGameStore();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") moveGhost("up");
      if (e.key === "ArrowDown") moveGhost("down");
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [moveGhost]);

  return (
    <Sprite
      image="/ghost.png"
      x={100}
      y={ghostY}
      width={80}
      height={80}
      anchor={new PIXI.Point(0.5, 0.5)}
    />
  );
}
