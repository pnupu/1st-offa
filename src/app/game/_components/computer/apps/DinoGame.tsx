'use client';

import React, { useState, useEffect } from 'react';
import { api } from "@/trpc/react";

const DinoGame = () => {
  const [isJumping, setIsJumping] = useState(false);
  const [dinoPosition, setDinoPosition] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(10);

  // Independent obstacle positions and properties
  const [obstacle1Position, setObstacle1Position] = useState(800);
  const [obstacle1Height, setObstacle1Height] = useState(30);
  const [obstacle1IsDouble, setObstacle1IsDouble] = useState(false);

  const [obstacle2Position, setObstacle2Position] = useState(1200);
  const [obstacle2Height, setObstacle2Height] = useState(40); 
  const [obstacle2IsDouble, setObstacle2IsDouble] = useState(false);

  const [obstacle3Position, setObstacle3Position] = useState(1600);
  const [obstacle3Height, setObstacle3Height] = useState(50);
  const [obstacle3IsDouble, setObstacle3IsDouble] = useState(false);

  const jumpThreshold = 20; // Buffer from the ground to allow a jump
  const jumpHeightLimit = 150; // Maximum jump height
  const minDistanceBetweenObstacles = 200;

  const createGameEvent = api.gameEvent.create.useMutation();
  const createPost = api.post.create.useMutation();

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [hasShared, setHasShared] = useState(false);

  // Track game session for OCEAN impacts
  useEffect(() => {
    if (score > 0 && isGameOver) {
      // Get the user's current high score
      const currentHighScore = parseInt(localStorage.getItem('dinoHighScore') ?? '0');
      
      // Only save and create event if this is a new high score
      if (score > currentHighScore) {
        localStorage.setItem('dinoHighScore', score.toString());
        
        createGameEvent.mutate({
          type: "DINO_GAME_PLAYED",
          score: score,
          oceanScores: {
            conscientiousness: -0.05,
            neuroticism: -0.05,
            extraversion: 0.05
          }
        });

        // Additional OCEAN impacts for beating personal best
        createGameEvent.mutate({
          type: "DINO_GAME_HIGHSCORE",
          oceanScores: {
            conscientiousness: 0.1,
            neuroticism: -0.1
          }
        });
      }
    }
  }, [isGameOver]);

  // Move each obstacle independently and reset if off-screen
  useEffect(() => {
    if (isGameOver) return;

    const obstacleTimer = setInterval(() => {
      // Adjust minDistanceBetweenObstacles based on speed
      const minDistanceBetweenObstacles = 200 + (speed - 10) * 10;

      const resetObstacle = (
        prevPos: number,
        otherObstaclePositions: number[],
        setHeight: (height: number) => void,
        setIsDouble: (isDouble: boolean) => void
      ) => {
        if (prevPos > -50) return prevPos - speed;

        let newPosition: number;
        do {
          newPosition = Math.random() * 200 + 800;
        } while (
          otherObstaclePositions.some(
            (pos) => Math.abs(pos - newPosition) < minDistanceBetweenObstacles
          )
        );

        setHeight(Math.random() * 30 + 30);
        setIsDouble(score >= 20 && Math.random() < 0.5);

        setScore((prevScore) => prevScore + 1);
        return newPosition;
      };

      setObstacle1Position((prev) =>
        resetObstacle(prev, [obstacle2Position, obstacle3Position], setObstacle1Height, setObstacle1IsDouble)
      );
      setObstacle2Position((prev) =>
        resetObstacle(prev, [obstacle1Position, obstacle3Position], setObstacle2Height, setObstacle2IsDouble)
      );
      setObstacle3Position((prev) =>
        resetObstacle(prev, [obstacle1Position, obstacle2Position], setObstacle3Height, setObstacle3IsDouble)
      );

      setSpeed((prevSpeed) => Math.min(prevSpeed + 0.01, 20));
    }, 20);

    return () => clearInterval(obstacleTimer);
  }, [isGameOver, speed, score, obstacle1Position, obstacle2Position, obstacle3Position]);

  useEffect(() => {
    // Initialize background music
    const backgroundMusic = new Audio('/assets/sounds/dinobot/NeuroticDinobot.mp3');
    backgroundMusic.loop = true;

    // Play the music when component mounts
    backgroundMusic.play().catch((error) => {
      console.error("Failed to play audio:", error);
    });

    // Pause and reset the music when component unmounts
    return () => {
      backgroundMusic.pause();
      backgroundMusic.currentTime = 0;
    };
  }, []);
  // Jump logic, independent of obstacle movement
  useEffect(() => {
    if (!isJumping) return;

    let jumpHeight = dinoPosition;
    const jumpUp = setInterval(() => {
      if (jumpHeight < jumpHeightLimit) {
        jumpHeight += 15;
        setDinoPosition(jumpHeight);
      } else {
        clearInterval(jumpUp);
        const fallDown = setInterval(() => {
          if (jumpHeight > 0) {
            jumpHeight -= 15;
            setDinoPosition(jumpHeight);
          } else {
            setIsJumping(false);
            clearInterval(fallDown);
          }
        }, 20);
      }
    }, 20);
  }, [isJumping]);

  // Collision detection for each obstacle
  useEffect(() => {
    const checkCollision = (position: number, height: number) => {
      if (position > 20 && position < 80 && dinoPosition < height) {
        setIsGameOver(true);
      }
    };

    checkCollision(obstacle1Position, obstacle1Height);
    checkCollision(obstacle2Position, obstacle2Height);
    checkCollision(obstacle3Position, obstacle3Height);
  }, [obstacle1Position, obstacle2Position, obstacle3Position, dinoPosition]);

  // Handle jump on spacebar press, considering jump threshold
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
         if (!isJumping || dinoPosition <= jumpThreshold) {
          setIsJumping(true);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isJumping, isGameOver, dinoPosition]);

  // Restart the game
  const restartGame = () => {
    // Create game event for restarting (showing persistence)
    if (score > 0) {
      createGameEvent.mutate({
        type: "DINO_GAME_RESTART",
        oceanScores: {
          conscientiousness: 0.02,  // Small boost for persistence
          neuroticism: -0.02       // Slight decrease for handling failure well
        }
      });
    }

    setIsGameOver(false);
    setDinoPosition(0);
    setObstacle1Position(800);
    setObstacle2Position(1200);
    setObstacle3Position(1600);
    setHasShared(false);
    setScore(0);
    setSpeed(10);
  };

  // Modal component
  const Modal = () => showModal ? (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[52]">
      <div className="bg-white p-4 rounded-lg w-[300px]">
        <h3 className="text-lg font-bold mb-2">Score Shared!</h3>
        <p className="text-sm mb-3">{modalMessage}</p>
        <button
          onClick={() => setShowModal(false)}
          className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  ) : null;

  // Share score function with duplicate check
  const shareScore = () => {
    if (score > 0 && !hasShared) {
      // Create post on CheckedOut
      createPost.mutate({
        content: `Just scored ${score} points in the Bunny Jump game! 🐰`,
      }, {
        onSuccess: () => {
          setModalMessage(`Your score of ${score} points has been shared on CheckedOut!`);
          setShowModal(true);
          setHasShared(true);
        },
        onError: () => {
          setModalMessage('Unable to share score. Please try again later.');
          setShowModal(true);
        }
      });

      // Create game event for sharing score
      createGameEvent.mutate({
        type: "DINO_GAME_SHARE",
        oceanScores: {
          extraversion: 0.1,        // Boost for social sharing
          agreeableness: 0.05,      // Small boost for community participation
          neuroticism: -0.03        // Slight decrease for social confidence
        }
      });

      // Add achievement-based OCEAN impacts
      if (score >= 50) {
        createGameEvent.mutate({
          type: "DINO_GAME_HIGH_SCORE",
          oceanScores: {
            conscientiousness: 0.1,  // Good boost for achieving high score
            neuroticism: -0.05      // Decrease for mastery
          }
        });
      }
    } else if (hasShared) {
      setModalMessage('You have already shared this score!');
      setShowModal(true);
    }
  };

  return (
    <div 
      className="relative w-full h-full bg-gray-100 overflow-hidden flex items-end justify-center"
    >
      <Modal />
      <div className='absolute top-0 left-0 w-full h-full z-[50]'>
      {/* Score and Game Over Display */}
      <div className="absolute top-2 left-2 text-lg font-bold text-gray-800 z-[51]">
        Score: {score}
      </div>

      {isGameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-700 bg-opacity-50 z-[50]">
          <div className="text-2xl font-bold text-white mb-4">Game Over!</div>
          <div className="text-lg font-semibold text-white mb-6">Final Score: {score}</div>
          <button
            onClick={restartGame}
            className="bg-green-500 text-white font-semibold py-2 px-4 rounded-md mb-2 hover:bg-green-600"
          >
            Play Again
          </button>
          <button
            onClick={shareScore}
            className={`${
              hasShared 
                ? 'bg-gray-500 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white font-semibold py-2 px-4 rounded-md`}
          >
            {hasShared ? 'Score Shared!' : 'Share Score on CheckedOut'}
          </button>
        </div>
      )}
      </div>
      <div 
        className='absolute top-0 left-0 w-full h-full bg-[#f7f7f7] z-[49]'
        style={{
          backgroundImage: `url('/assets/apps/Sky.svg')`,
          backgroundSize: 'cover'
        }}
        >
        <div className="relative w-full h-[80%]">
        {/* Dinosaur */}
        <div
          className="absolute bottom-0 left-10 w-10 h-[72px] rounded"
          style={{
            bottom: `${dinoPosition}px`,
            transition: isJumping ? 'none' : 'bottom 0.1s ease-out',
            backgroundImage: `url('/assets/apps/Bunny.svg')`,
          }}
        ></div>

        {/* Obstacle 1 */}
        <div
          className="absolute bottom-0 bg-red-500 w-10"
          style={{
            left: `${obstacle1Position}px`,
            height: `${obstacle1Height}px`,
            backgroundImage: `url('/assets/apps/Roskis.svg')`,
            backgroundSize: 'cover',
          }}
        ></div>
        {obstacle1IsDouble && (
          <div
            className="absolute bottom-0 bg-red-500 w-10"
            style={{
              left: `${obstacle1Position + 12}px`,
              height: `${obstacle1Height}px`,
              backgroundImage: `url('/assets/apps/Roskis.svg')`,
              backgroundSize: 'cover',
            }}
          ></div>
        )}

        {/* Obstacle 2 */}
        <div
          className="absolute bottom-0 bg-red-500 w-10"
          style={{
            left: `${obstacle2Position}px`,
            height: `${obstacle2Height}px`,
            backgroundImage: `url('/assets/apps/Roskis.svg')`,
            backgroundSize: 'cover',
          }}
        ></div>
        {obstacle2IsDouble && (
          <div
            className="absolute bottom-0 bg-red-500 w-10"
            style={{
              left: `${obstacle2Position + 12}px`,
              height: `${obstacle2Height}px`,
              backgroundImage: `url('/assets/apps/Roskis.svg')`,
              backgroundSize: 'cover',
            }}
          ></div>
        )}

        {/* Obstacle 3 */}
        <div
          className="absolute bottom-0 bg-red-500 w-10"
          style={{
            left: `${obstacle3Position}px`,
            height: `${obstacle3Height}px`,
            backgroundImage: `url('/assets/apps/Roskis.svg')`,
            backgroundSize: 'cover',
          }}
        ></div>
        {obstacle3IsDouble && (
          <div
            className="absolute bottom-0 bg-red-500 w-10"
            style={{
              left: `${obstacle3Position + 12}px`,
              height: `${obstacle3Height}px`,
              backgroundImage: `url('/assets/apps/Roskis.svg')`,
              backgroundSize: 'cover',
            }}
          ></div>
        )}
        </div>
        <div 
          className="relative w-full h-[29%] bg-gray-800 z-[50]" 
          style={{
            backgroundImage: `url('/assets/apps/Ground.svg')`,
            backgroundSize: 'cover'
          }}
        />
        </div>
      </div>
  );
};

export default DinoGame;
