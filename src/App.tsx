import React from 'react';
import './App.css';
import GameStage from "./components/GameStage";

export default function App() {
  return (
    <div className="App">
      <div style={{ textAlign: "center" }}>
      <h2>👻 Flash-Style Mini Game</h2>
      <GameStage />
    </div>
    </div>
  );
}

