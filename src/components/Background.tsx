import { Sprite } from "@pixi/react";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import * as PIXI from "pixi.js";
import useGameStore from "../store/useGameStore";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export default function Background() {
  const bg1 = useRef<PIXI.Sprite | null>(null);
  const bg2 = useRef<PIXI.Sprite | null>(null);

  const bgWidth = 3313;
  const bgHeight = 1080;


  const viewWidth = 1920;
  const viewHeight = 1080;


  const scale = viewHeight / bgHeight;
  const displayWidth = bgWidth * scale;
  const displayHeight = bgHeight * scale;

  useLayoutEffect(() => {
    const s1 = bg1.current;
    const s2 = bg2.current;
    if (!s1 || !s2) return;

    // 처음 위치 설정
    s1.x = 0;
    s2.x = displayWidth - 2;

    const tween1 = gsap.to(s1, {
      x: -displayWidth,
      duration: 20, // 배경 속도 (커질수록 느림)
      repeat: -1,
      ease: "none",
      modifiers: {
        x: (x) => (parseFloat(x) <= -displayWidth ? displayWidth - 2 : x),
      },
    });

    const tween2 = gsap.to(s2, {
      x: 0,
      duration: 20,
      repeat: -1,
      ease: "none",
      modifiers: {
        x: (x) => (parseFloat(x) <= -displayWidth ? displayWidth - 2 : x),
      },
    });

    // 게임 상태에 따라 정지 / 재생
    const unsubscribe = useGameStore.subscribe((state) => {
      if (state.gameState !== "playing") {
        tween1.pause();
        tween2.pause();
      } else {
        tween1.play();
        tween2.play();
      }
    });

    return () => {
      tween1.kill();
      tween2.kill();
      unsubscribe();
    };
  }, [displayWidth]);

  return (
    <>
      <Sprite
        ref={bg1 as any}
        image="/bg.png"
        x={0}
        y={0}
        width={displayWidth}
        height={displayHeight}
      />
      <Sprite
        ref={bg2 as any}
        image="/bg.png"
        x={displayWidth}
        y={0}
        width={displayWidth}
        height={displayHeight}
      />
    </>
  );
}
