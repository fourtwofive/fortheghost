import "pixi.js";

declare module "@pixi/react" {
  interface Sprite {
    eventMode?: string;
  }
}