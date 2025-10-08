import useGameStore from "../store/useGameStore";

export default function ControlPanel() {
  const moveGhost = useGameStore((s) => s.moveGhost);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        alignItems: "center",
      }}
    >
      {["up", "down"].map((dir) => (
        <button
          key={dir}
          onClick={() => moveGhost(dir as "up" | "down")}
          style={{
            width: "80px",
            height: "80px",
            fontSize: "32px",
            cursor: "pointer",
            borderRadius: "12px",
            background: "linear-gradient(145deg, #1c1c1c, #2a2a2a)",
            color: "white",
            border: "1px solid #444",
            boxShadow: "2px 2px 8px rgba(0,0,0,0.5)",
            transition: "0.2s ease-in-out",
          }}
          onMouseEnter={(e) =>
            ((e.target as HTMLButtonElement).style.background =
              "linear-gradient(145deg, #2f2f2f, #3a3a3a)")
          }
          onMouseLeave={(e) =>
            ((e.target as HTMLButtonElement).style.background =
              "linear-gradient(145deg, #1c1c1c, #2a2a2a)")
          }
        >
          {dir === "up" ? "▲" : "▼"}
        </button>
      ))}
    </div>
  );
}
