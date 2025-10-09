import useGameStore from "../store/useGameStore";

export default function ControlPanel() {
  const { setDirection } = useGameStore();

  const buttonStyle: React.CSSProperties = {
    width: "65px",
    height: "65px",
    background: "rgba(255, 255, 255, 0.08)",
    backdropFilter: "blur(10px) saturate(180%)",
    WebkitBackdropFilter: "blur(10px) saturate(180%)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "12px",
    boxShadow:
      "inset 0 1px 3px rgba(255,255,255,0.3), 0 4px 12px rgba(0,0,0,0.4)",
    fontSize: "28px",
    color: "#fff",
    textShadow: "0 0 8px rgba(255,255,255,0.6)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.25s ease",
  };


  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <button
        style={buttonStyle}
        onMouseDown={() => setDirection("up")}
        onMouseUp={() => setDirection(null)}
        onMouseLeave={() => setDirection(null)} // 마우스 밖으로 나가면 멈춤
        onTouchStart={() => setDirection("up")} // 모바일 터치
        onTouchEnd={() => setDirection(null)}
      >
        ▲
      </button>
      <button
        style={buttonStyle}
        onMouseDown={() => setDirection("down")}
        onMouseUp={() => setDirection(null)}
        onMouseLeave={() => setDirection(null)}
        onTouchStart={() => setDirection("down")}
        onTouchEnd={() => setDirection(null)}
      >
        ▼
      </button>
    </div>
  );
}
