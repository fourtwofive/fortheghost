import { Stage } from "@pixi/react";
import GameStage from "./components/GameStage";
import ControlPanel from "./components/ControlPanel";
import "./App.css";

export default function App() {
  return (
    <div
      className="App"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        gap: "40px",
        backgroundColor: "#111",
        flexDirection: "column",
      }}
    >
      <h2 style={{ color: "white", marginBottom: "10px" }}>👻 Flash-Style Mini Game</h2>

      {/* 게임 + 버튼 묶음 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "20px",
        }}
      >
        <Stage width={800} height={600} options={{ backgroundColor: 0x000000 }}>
          <GameStage />
        </Stage>

        {/* 오른쪽 버튼 */}
        <ControlPanel />
      </div>
    </div>
  );
}
