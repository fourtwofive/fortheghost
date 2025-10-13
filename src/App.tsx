import { useEffect, useState } from "react";
import { Stage } from "@pixi/react";
import GameStage from "./components/GameStage";
import ControlPanel from "./components/ControlPanel";
import "./App.css";

export default function App() {
  const [size, setSize] = useState({ width: 1920, height: 1080 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const ratio = 1920 / 1080;

      let newWidth = w * 0.9;
      let newHeight = newWidth / ratio;
      if (newHeight > h * 0.8) {
        newHeight = h * 0.8;
        newWidth = newHeight * ratio;
      }
      setSize({ width: newWidth, height: newHeight });
      setIsMobile(w < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className="App"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      <h2
        style={{
          marginBottom: "10px",
          textAlign: "center",
          fontFamily: "Creepster, cursive",
          fontWeight: 600,
          fontSize: "4rem",
          color: "#fff",
          letterSpacing: "0.2rem",
          transform: "scaleY(0.8)",
          display: "inline-block",
        }}
      >
        For the Ghost
      </h2>
      {/* 게임 + 버튼 묶음 */}
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "center",
          gap: "20px",
        }}
      >
        <Stage width={size.width} height={size.height} options={{ backgroundColor: 0x000000 }}>
          <GameStage />
        </Stage>
        <ControlPanel />
      </div>
    </div>
  );
}