'use client';

import { GameTimeProvider } from "./_components/GameTimeContext";
import Game from "./_components/Game";

const GamePage = () => {
  return (
    <div style={{ textAlign: 'center', height: "100vh", width: "100vw", display: "flex", alignItems: "center", justifyContent: "center", background: "black" }}>
      <GameTimeProvider>
        <Game />
      </GameTimeProvider>
    </div>
  );
};

export default GamePage;
