import { Sprite, useTick } from "@pixi/react";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import * as PIXI from "pixi.js";
import useGameStore from "../store/useGameStore";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export default function Player() {
  const { setGhostY, direction, setDirection, gameState } = useGameStore();
  const ref = useRef<PIXI.Sprite | null>(null);
  const [y, setY] = useState(300);
  const [velocity, setVelocity] = useState(0);

  const ACCELERATION = 0.45;
  const MAX_SPEED = 7;
  const FRICTION = 0.9;

  // 애니메이션
  useEffect(() => {
    if (!ref.current) return;
    const ghost = ref.current;

    const floatTween = gsap.to(ghost, {
      y: "+=10",
      duration: 1.6,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });

    return () => {
      gsap.killTweensOf(ghost);
    };
  }, []);

  // 키보드 입력 처리
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "w") setDirection("up");
      if (e.key === "ArrowDown" || e.key === "s") setDirection("down");
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (
        e.key === "ArrowUp" ||
        e.key === "ArrowDown" ||
        e.key === "w" ||
        e.key === "s"
      ) {
        setDirection(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // 부드러운 이동
  useTick(() => {
    if (gameState !== "playing") return;
    const ghost = ref.current;
    if (!ghost) return;

    setVelocity((v) => {
      let newV = v;
      if (direction === "up") newV -= ACCELERATION;
      else if (direction === "down") newV += ACCELERATION;
      else newV *= FRICTION;
      if (newV > MAX_SPEED) newV = MAX_SPEED;
      if (newV < -MAX_SPEED) newV = -MAX_SPEED;
      return newV;
    });

    setY((prev) => {
      const nextY = prev + velocity;
      const clamped = Math.max(40, Math.min(560, nextY));
      setGhostY(clamped);

      gsap.killTweensOf(ghost);
      gsap.to(ghost, {
        y: clamped,
        duration: 0.1,
        ease: "power2.out",
        overwrite: "auto",
      });

      return clamped;
    });
  });

  useEffect(() => {
    return () => {
      if (ref.current) gsap.killTweensOf(ref.current);
    };
  }, []);

  return (
    <Sprite
      ref={ref as any}
      image="/ghost.png"
      x={100}
      y={y}
      width={60}
      height={60}
      anchor={0.5}
    />
  );
}
