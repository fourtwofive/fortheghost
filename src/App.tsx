import { useEffect, useState } from "react";
import { Stage } from "@pixi/react";
import GameStage from "./components/GameStage";
import ControlPanel from "./components/ControlPanel";
import "./App.css";

export default function App() {
  const [scale, setScale] = useState(1);
  const [windowSize, setWindowSize] = useState({ width: 1920, height: 1080 });
  const [titleFont, setTitleFont] = useState(75);

  useEffect(() => {
    const baseWidth = 1920;
    const baseHeight = 1080;

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      // Stage 비율 계산 (제목 포함)
      const ratio = Math.min(w / baseWidth, h / (baseHeight + 200));
      setScale(ratio);
      setWindowSize({ width: w, height: h });

      // 제목 글씨 반응형
      if (w < 768) setTitleFont(50);
      else if (w < 1024) setTitleFont(60);
      else setTitleFont(75);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  
  const buttonScale = Math.max(0.6, scale); 

  return (
    <div
      className="App"
      style={{
        backgroundColor: "#111",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      {/* 제목 */}
      <h2
        style={{
          position: "absolute",
          top: "2%",
          left: "50%",
          transform: "translateX(-50%) scaleY(0.85)",
          margin: 0,
          padding: 0,
          fontFamily: "Creepster, cursive",
          fontWeight: 600,
          fontSize: `${titleFont}px`,
          color: "#fff",
          whiteSpace: "nowrap",
          letterSpacing: "0.15em",
          textShadow: "0 4px 10px rgba(0,0,0,0.7)",
          zIndex: 10,
        }}
      >
        FOR THE GHOST
      </h2>

      {/* Stage */}
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          width: `${1920}px`,
          height: `${1080}px`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "60px",
        }}
      >
        <Stage
          width={1920}
          height={1080}
          options={{
            backgroundColor: 0x000000,
            resolution: window.devicePixelRatio,
            autoDensity: true,
          }}
          style={{
            width: "1920px",
            height: "1080px",
          }}
        >
          <GameStage />
        </Stage>
      </div>

      {/* 버튼 */}
      <div
        style={{
          position: "absolute",
          right: "5%",
          top: "55%",
          transform: `translateY(-50%) scale(${buttonScale})`,
          transformOrigin: "center right",
          zIndex: 20,
        }}
      >
        <ControlPanel />
      </div>
    </div>
  );
}
