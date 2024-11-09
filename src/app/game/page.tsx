'use client';

import { GameTimeProvider } from "./_components/GameTimeContext";
import Game from "./_components/Game";
import { TaskProvider } from "./_components/TaskContext";
import { AppStateProvider } from './_components/computer/AppStateContext';

const GamePage = () => {
  return (
    <div style={{ textAlign: 'center', height: "100vh", width: "100vw", display: "flex", alignItems: "center", justifyContent: "center", background: "black" }}>
      <TaskProvider>
      <AppStateProvider>
        <GameTimeProvider>
          <Game />  
        </GameTimeProvider>
      </AppStateProvider>
      </ TaskProvider>
    </div>
  );
};

export default GamePage;
