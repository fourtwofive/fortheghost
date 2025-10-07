import { Sprite } from "@pixi/react";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import * as PIXI from "pixi.js";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export default function Background() {
  const bg1 = useRef<PIXI.Sprite | null>(null);
  const bg2 = useRef<PIXI.Sprite | null>(null);

  useLayoutEffect(() => {
    // GSAP context로 안전하게 관리
    const ctx = gsap.context(() => {
      const s1 = bg1.current;
      const s2 = bg2.current;
      if (!s1 || !s2) return;

      gsap.to(s1, {
        x: -800,
        duration: 6,
        repeat: -1,
        ease: "none",
        modifiers: {
          x: (x) => (parseFloat(x) <= -800 ? 800 : x),
        },
      });

      gsap.to(s2, {
        x: 0,
        duration: 6,
        repeat: -1,
        ease: "none",
        modifiers: {
          x: (x) => (parseFloat(x) <= -800 ? 800 : x),
        },
      });
    });

    return () => ctx.revert(); // 💥 언마운트 시 트윈 완전 제거
  }, []);

  return (
    <>
      <Sprite ref={bg1 as any} image="/bg.png" x={0} y={0} width={800} height={600} />
      <Sprite ref={bg2 as any} image="/bg.png" x={800} y={0} width={800} height={600} />
    </>
  );
}
