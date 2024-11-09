'use client';

import { GameTimeProvider } from "./_components/GameTimeContext";
import Game from "./_components/Game";
import { TaskProvider } from "./_components/TaskContext";

const GamePage = () => {
  return (
    <div style={{ textAlign: 'center', height: "100vh", width: "100vw", display: "flex", alignItems: "center", justifyContent: "center", background: "black" }}>
      <TaskProvider>
        <GameTimeProvider>
          <Game />
        </GameTimeProvider>
      </ TaskProvider>
    </div>
  );
};

export default GamePage;
