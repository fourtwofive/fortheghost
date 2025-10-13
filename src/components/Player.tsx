import { AnimatedSprite, useTick } from "@pixi/react";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import * as PIXI from "pixi.js";
import useGameStore from "../store/useGameStore";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export default function Player() {
  const { setGhostY, direction, setDirection, gameState } = useGameStore();
  const ref = useRef<PIXI.AnimatedSprite | null>(null);
  const [y, setY] = useState(300);
  const [velocity, setVelocity] = useState(0);
  const [textures, setTextures] = useState<PIXI.Texture[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [isDead, setIsDead] = useState(false);


  const ACCELERATION = 0.45;
  const MAX_SPEED = 7;
  const FRICTION = 0.9;

  useEffect(() => {
    async function loadTextures() {
      const paths = [
        "/player1.png",
        "/player2.png",
        "/player3.png",
        "/player4.png",
        "/player5.png",

      ];

      try {
        const loadedTextures = await Promise.all(
          paths.map(async (p) => {
            const tex = await PIXI.Assets.load(p);
            return tex instanceof PIXI.Texture ? tex : PIXI.Texture.from(p);
          })
        );
        setTextures(loadedTextures);
        setLoaded(true);
      } catch (err) {
        console.error("Texture load failed:", err);
      }
    }

    loadTextures();
  }, []);

  // 떠다니는 애니메이션
  useEffect(() => {
    const ghost = ref.current;
    if (!ghost) return;

    ghost.animationSpeed = 0.15;
    ghost.loop = true;
    ghost.play();

    const floatTween = gsap.to(ghost, {
      y: "+=10",
      duration: 1.6,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });

    return () => gsap.killTweensOf(ghost);
  }, [loaded]);

  // 키 입력 처리
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "w", "s"].includes(e.key)) e.preventDefault();
      if (e.key === "ArrowUp" || e.key === "w") setDirection("up");
      if (e.key === "ArrowDown" || e.key === "s") setDirection("down");
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "w", "s"].includes(e.key)) e.preventDefault();
      setDirection(null);
    };

    window.addEventListener("keydown", handleKeyDown, { passive: false });
    window.addEventListener("keyup", handleKeyUp, { passive: false });
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // 이동 로직
  useTick(() => {
    if (gameState !== "playing" || !ref.current) return;
    const ghost = ref.current;
    const groundY = 950;
    const minY = 120; 
    setVelocity((v) => {
      let newV = v;
      if (direction === "up") newV -= ACCELERATION;
      else if (direction === "down") newV += ACCELERATION;
      else newV *= FRICTION;
      return Math.max(-MAX_SPEED, Math.min(MAX_SPEED, newV));
    });

    setY((prev) => {
      const nextY = prev + velocity;
      const clamped = Math.max(minY, Math.min(groundY, nextY));
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

  //사망모션
  useEffect(() => {
    const ghost = ref.current;
    if (!ghost) return;

    if (gameState === "dying") {
      setIsDead(true);
      ghost.textures = [PIXI.Texture.from("/deadplayer.png")];
      ghost.loop = false;
      ghost.play();

      const groundY = 980;
      // 위로 튀었다가 떨어지기
      gsap.killTweensOf(ghost);
      gsap.to(ghost, {
        y: "-=50",        // 위로 살짝 점프
        duration: 0.4,
        ease: "power1.out",
        onComplete: () => {
          gsap.to(ghost, {
            y: groundY,   // 바닥으로 떨어짐
            rotation: -0.5,
            duration: 1.2,
            ease: "bounce.out",
            onComplete: () => {
              setTimeout(() => {
                useGameStore.getState().setGameState("over");
              }, 400);
            },
          });
        },
      });
    }
  }, [gameState]);



  // GSAP 정리
  useEffect(() => {
    return () => {
      if (ref.current) gsap.killTweensOf(ref.current);
    };
  }, []);

  if (!loaded || textures.length < 5) return null;

  return (
    <AnimatedSprite
      ref={ref as any}
      textures={textures}
      x={300}
      y={y}
      width={300}
      height={400}
      anchor={0.5}
      isPlaying={true}
      animationSpeed={0.1}
      loop={true}
    />
  );
}
