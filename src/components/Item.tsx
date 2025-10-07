import { Sprite } from "@pixi/react";
import { useState } from "react";
import { Howl } from "howler";

export default function Item({
  x,
  y,
  onCollect,
}: {
  x: number;
  y: number;
  onCollect: () => void;
}) {
  const [collected, setCollected] = useState(false);
  const sound = new Howl({ src: ["/collect.wav"] });

  const handleClick = () => {
    if (!collected) {
      setCollected(true);
      sound.play();
      onCollect();
    }
  };

  if (collected) return null;
  return (
    <Sprite
      image="/candle.png"
      x={x}
      y={y}
      scale={0.07}
      interactive
      pointerdown={handleClick}
    />
  );
}
