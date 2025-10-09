import useGameStore from "../store/useGameStore";

export default function ControlPanel() {
  const { setDirection } = useGameStore();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <button
        onMouseDown={() => setDirection("up")}
        onMouseUp={() => setDirection(null)}
        onMouseLeave={() => setDirection(null)} // 마우스 밖으로 나가면 멈춤
      >
        ▲ UP
      </button>
      <button
        onMouseDown={() => setDirection("down")}
        onMouseUp={() => setDirection(null)}
        onMouseLeave={() => setDirection(null)}
      >
        ▼ DOWN
      </button>
    </div>
  );
}
