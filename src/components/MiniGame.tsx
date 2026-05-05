import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Trophy, RotateCcw, Play } from 'lucide-react';
import { assetPath } from '@/lib/assetPath';

interface Obstacle {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'star' | 'cactus';
}

// 8-bit sound synthesizer using Web Audio API
const createAudioContext = () => {
  if (typeof window !== 'undefined' && window.AudioContext) {
    return new AudioContext();
  }
  return null;
};

// 8-bit jump sound - ascending square wave
const playJumpSound = (audioContext: AudioContext | null) => {
  if (!audioContext) return;
  
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.15);
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.15);
};

// 8-bit game over sound - descending sawtooth with noise
const playGameOverSound = (audioContext: AudioContext | null) => {
  if (!audioContext) return;
  
  // Descending tone
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.type = 'sawtooth';
  oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.5);
  
  gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.5);
  
  // Second lower tone for depth
  const oscillator2 = audioContext.createOscillator();
  const gainNode2 = audioContext.createGain();
  
  oscillator2.type = 'square';
  oscillator2.frequency.setValueAtTime(200, audioContext.currentTime);
  oscillator2.frequency.exponentialRampToValueAtTime(25, audioContext.currentTime + 0.5);
  
  gainNode2.gain.setValueAtTime(0.2, audioContext.currentTime);
  gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
  
  oscillator2.connect(gainNode2);
  gainNode2.connect(audioContext.destination);
  
  oscillator2.start(audioContext.currentTime);
  oscillator2.stop(audioContext.currentTime + 0.5);
};

export function MiniGame() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [characterY, setCharacterY] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [characterFrame, setCharacterFrame] = useState(0);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  
  const gameLoopRef = useRef<number | null>(null);
  const obstacleSpawnRef = useRef<number | null>(null);
  const scoreRef = useRef(0);
  const speedRef = useRef(5);
  const jumpVelocityRef = useRef(0);
  const characterYRef = useRef(0);
  const isJumpingRef = useRef(false);
  const obstaclesRef = useRef<Obstacle[]>([]);
  const highScoreRef = useRef(0);
  const audioContextRef = useRef<AudioContext | null>(null);

  const GROUND_Y = 280;
  const JUMP_FORCE = -13;
  const GRAVITY = 0.6;
  const CHARACTER_X = 80;
  const CHARACTER_WIDTH = 50;
  const CHARACTER_HEIGHT = 70;

  // Start game
  const startGame = useCallback(() => {
    // Initialize audio context on user interaction
    if (!audioContextRef.current) {
      audioContextRef.current = createAudioContext();
    }
    // Resume audio context if suspended (browser policy)
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }
    
    setIsPlaying(true);
    setGameOver(false);
    setIsNewHighScore(false);
    setScore(0);
    scoreRef.current = 0;
    speedRef.current = 5;
    setCharacterY(0);
    characterYRef.current = 0;
    jumpVelocityRef.current = 0;
    setIsJumping(false);
    isJumpingRef.current = false;
    setObstacles([]);
    obstaclesRef.current = [];
    setCharacterFrame(0);

    // Game loop
    const gameLoop = () => {
      // Update character physics
      if (isJumpingRef.current || characterYRef.current < 0) {
        jumpVelocityRef.current += GRAVITY;
        characterYRef.current += jumpVelocityRef.current;
        
        if (characterYRef.current >= 0) {
          characterYRef.current = 0;
          jumpVelocityRef.current = 0;
          isJumpingRef.current = false;
          setIsJumping(false);
        }
        setCharacterY(characterYRef.current);
      }

      // Update obstacles (move left)
      obstaclesRef.current = obstaclesRef.current
        .map(obs => ({ ...obs, x: obs.x - speedRef.current }))
        .filter(obs => obs.x > -100);

      // Check collision
      const charLeft = CHARACTER_X;
      const charRight = CHARACTER_X + CHARACTER_WIDTH;
      const charTop = GROUND_Y + characterYRef.current;
      const charBottom = GROUND_Y + characterYRef.current + CHARACTER_HEIGHT;

      for (const obs of obstaclesRef.current) {
        const obsLeft = obs.x;
        const obsRight = obs.x + obs.width;
        const obsTop = obs.y;
        const obsBottom = obs.y + obs.height;
        
        if (
          charLeft < obsRight - 10 &&
          charRight > obsLeft + 10 &&
          charTop < obsBottom - 5 &&
          charBottom > obsTop + 5
        ) {
          endGame();
          return;
        }
      }

      setObstacles([...obstaclesRef.current]);

      // Update score and speed
      scoreRef.current += 0.1;
      setScore(Math.floor(scoreRef.current));
      
      // Increase speed gradually
      if (scoreRef.current % 100 < 0.1) {
        speedRef.current = Math.min(5 + scoreRef.current / 200, 12);
      }

      // Animate character frame (slowed down 3x)
      setCharacterFrame(prev => (prev + 0.067) % 4);

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    // Spawn obstacles
    const spawnObstacle = () => {
      const types: ('star' | 'cactus')[] = ['star', 'cactus'];
      const type = types[Math.floor(Math.random() * types.length)];
      
      const newObstacle: Obstacle = {
        id: Date.now(),
        x: 450,
        y: type === 'star' ? GROUND_Y - 30 + Math.random() * 20 : GROUND_Y - 40,
        width: type === 'star' ? 35 : 30,
        height: type === 'star' ? 35 : 50,
        type,
      };
      
      obstaclesRef.current.push(newObstacle);
      
      const minSpawn = Math.max(800, 1500 - speedRef.current * 50);
      const maxSpawn = Math.max(1500, 2500 - speedRef.current * 100);
      const nextSpawn = minSpawn + Math.random() * (maxSpawn - minSpawn);
      
      obstacleSpawnRef.current = window.setTimeout(spawnObstacle, nextSpawn);
    };
    
    obstacleSpawnRef.current = window.setTimeout(spawnObstacle, 1500);

  }, []);

  // End game
  const endGame = useCallback(() => {
    setIsPlaying(false);
    setGameOver(true);
    
    // Play 8-bit game over sound
    playGameOverSound(audioContextRef.current);
    
    // Check if new high score BEFORE updating
    const currentScore = Math.floor(scoreRef.current);
    const isNewRecord = currentScore > highScoreRef.current && currentScore > 0;
    
    if (isNewRecord) {
      setIsNewHighScore(true);
      highScoreRef.current = currentScore;
      setHighScore(currentScore);
    } else {
      setIsNewHighScore(false);
    }
    
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    if (obstacleSpawnRef.current) {
      clearTimeout(obstacleSpawnRef.current);
      obstacleSpawnRef.current = null;
    }
  }, []);

  // Jump
  const jump = useCallback((e?: React.MouseEvent | React.TouchEvent) => {
    if (e) e.preventDefault();
    
    if (!isJumpingRef.current && isPlaying && !gameOver) {
      jumpVelocityRef.current = JUMP_FORCE;
      isJumpingRef.current = true;
      setIsJumping(true);
      // Play 8-bit jump sound
      playJumpSound(audioContextRef.current);
    }
  }, [isPlaying, gameOver]);

  // Keyboard controls - only for jumping during gameplay
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if ((e.code === 'Space' || e.code === 'ArrowUp') && isPlaying && !gameOver) {
        e.preventDefault();
        jump();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isPlaying, gameOver, jump]);

  // Cleanup on unmount or close
  useEffect(() => {
    if (!isOpen) {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      if (obstacleSpawnRef.current) {
        clearTimeout(obstacleSpawnRef.current);
        obstacleSpawnRef.current = null;
      }
    }
  }, [isOpen]);

  // Get character image based on state
  const getCharacterImage = () => {
    if (isJumping) {
      return assetPath('jump.png');
    }
    // Alternate between run1 and run2
    const frame = Math.floor(characterFrame);
    return frame % 2 === 0 ? assetPath('run1.png') : assetPath('run2.png');
  };

  return (
    <>
      {/* Game Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 px-4 py-3 font-pixel text-xs flex items-center gap-2 hover:scale-105 transition-transform"
        style={{
          background: '#ffd700',
          color: '#0a0a1a',
          border: '4px solid #fff',
          boxShadow: '4px 4px 0 #ff6b9d',
        }}
      >
        <Trophy className="w-4 h-4" />
        PLAY GAME
      </button>

      {/* Game Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: 'rgba(10, 10, 26, 0.95)' }}
        >
          {/* Close Button */}
          <button
            onClick={() => {
              setIsOpen(false);
              setIsPlaying(false);
              setGameOver(false);
              if (gameLoopRef.current) {
                cancelAnimationFrame(gameLoopRef.current);
                gameLoopRef.current = null;
              }
              if (obstacleSpawnRef.current) {
                clearTimeout(obstacleSpawnRef.current);
                obstacleSpawnRef.current = null;
              }
            }}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center"
            style={{
              background: '#ff6b9d',
              boxShadow: '2px 2px 0 rgba(0,0,0,0.3)',
            }}
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Game Container */}
          <div 
            className="relative overflow-hidden"
            style={{
              width: 400,
              height: 400,
              background: '#1a1a3e',
              border: '4px solid #6b4ee6',
              boxShadow: '8px 8px 0 #ff6b9d',
            }}
          >
            {/* Score */}
            <div className="absolute top-4 left-4 right-4 flex justify-between z-10">
              <div 
                className="px-3 py-1 font-pixel text-xs"
                style={{
                  background: '#0a0a1a',
                  color: '#00d4ff',
                  border: '2px solid #00d4ff',
                }}
              >
                {String(Math.floor(score)).padStart(5, '0')}
              </div>
              
              <div 
                className="px-3 py-1 font-pixel text-xs"
                style={{
                  background: '#0a0a1a',
                  color: '#ffd700',
                  border: '2px solid #ffd700',
                }}
              >
                HI {String(Math.floor(highScore)).padStart(5, '0')}
              </div>
            </div>

            {/* Game Area */}
            <div className="absolute inset-0">
              {/* Ground line */}
              <div 
                className="absolute left-0 right-0 h-1"
                style={{
                  top: GROUND_Y + CHARACTER_HEIGHT,
                  background: '#6b4ee6',
                }}
              />

              {/* Ground dots (moving effect) */}
              {isPlaying && (
                <div className="absolute left-0 right-0 overflow-hidden" style={{ top: GROUND_Y + CHARACTER_HEIGHT + 5, height: 20 }}>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 bg-[#6b4ee6]"
                      style={{
                        left: `${(i * 15 - (score * 2) % 60)}%`,
                        top: Math.random() * 15,
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Character */}
              <img
                src={getCharacterImage()}
                alt="Character"
                className="absolute"
                style={{
                  left: CHARACTER_X,
                  top: GROUND_Y + characterY,
                  width: CHARACTER_WIDTH,
                  height: CHARACTER_HEIGHT,
                  imageRendering: 'pixelated',
                }}
              />

              {/* Obstacles */}
              {obstacles.map(obs => (
                <div
                  key={obs.id}
                  className="absolute"
                  style={{
                    left: obs.x,
                    top: obs.y,
                    width: obs.width,
                    height: obs.height,
                  }}
                >
                  {obs.type === 'star' ? (
                    <div
                      className="w-full h-full"
                      style={{
                        background: '#ffd700',
                        clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                        boxShadow: '0 0 15px #ffd700',
                        animation: 'spin 2s linear infinite',
                      }}
                    />
                  ) : (
                    <div
                      className="w-full h-full flex flex-col items-center justify-end"
                    >
                      <div className="w-3/4 h-full bg-[#34d399] relative">
                        <div className="absolute -left-2 top-1/4 w-2 h-1/3 bg-[#34d399]" />
                        <div className="absolute -right-2 top-1/3 w-2 h-1/4 bg-[#34d399]" />
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Start Screen with START Button */}
              {!isPlaying && !gameOver && (
                <div 
                  className="absolute inset-0 flex flex-col items-center justify-center"
                  style={{ background: 'rgba(10, 10, 26, 0.9)' }}
                >
                  <h3 
                    className="font-pixel text-xl mb-4 text-center"
                    style={{ color: '#00d4ff', textShadow: '3px 3px 0 #6b4ee6' }}
                  >
                    STAR RUNNER
                  </h3>
                  
                  {/* Character preview */}
                  <img 
                    src={assetPath('run1.png')}
                    alt="Character"
                    className="w-16 h-16 mb-6 animate-bounce"
                    style={{
                      imageRendering: 'pixelated',
                    }}
                  />
                  
                  {/* START Button */}
                  <button
                    onClick={startGame}
                    className="px-8 py-4 font-pixel text-sm flex items-center gap-3 hover:scale-105 transition-transform"
                    style={{
                      background: '#00d4ff',
                      color: '#0a0a1a',
                      border: '4px solid #fff',
                      boxShadow: '6px 6px 0 #6b4ee6',
                    }}
                  >
                    <Play className="w-5 h-5" fill="currentColor" />
                    START GAME
                  </button>
                  
                  <p className="font-retro text-sm text-[#a0a0c0] mt-6 text-center">
                    Tap screen or press SPACE to jump
                  </p>
                </div>
              )}

              {/* Game Over Screen */}
              {gameOver && (
                <div 
                  className="absolute inset-0 flex flex-col items-center justify-center"
                  style={{ background: 'rgba(10, 10, 26, 0.95)' }}
                >
                  <h3 
                    className="font-pixel text-2xl mb-4"
                    style={{ color: '#ff6b9d', textShadow: '3px 3px 0 #6b4ee6' }}
                  >
                    GAME OVER
                  </h3>
                  
                  <div 
                    className="px-6 py-3 mb-4"
                    style={{
                      background: '#0a0a1a',
                      border: '2px solid #00d4ff',
                    }}
                  >
                    <p className="font-pixel text-sm text-white">
                      SCORE: {String(Math.floor(score)).padStart(5, '0')}
                    </p>
                  </div>
                  
                  {isNewHighScore && (
                    <p className="font-pixel text-xs text-[#ffd700] mb-4 animate-pulse">
                      ★ NEW HIGH SCORE! ★
                    </p>
                  )}
                  
                  <button
                    onClick={startGame}
                    className="px-6 py-3 font-pixel text-xs flex items-center gap-2"
                    style={{
                      background: '#00d4ff',
                      color: '#0a0a1a',
                      border: '4px solid #fff',
                      boxShadow: '4px 4px 0 #6b4ee6',
                    }}
                  >
                    <RotateCcw className="w-4 h-4" />
                    TRY AGAIN
                  </button>
                </div>
              )}
            </div>

            {/* Jump area (only during gameplay) */}
            {isPlaying && !gameOver && (
              <div 
                className="absolute inset-0 cursor-pointer"
                onClick={jump}
                onTouchStart={jump}
              />
            )}

            {/* Instructions during gameplay */}
            {isPlaying && !gameOver && (
              <div 
                className="absolute bottom-2 left-0 right-0 text-center font-retro text-xs pointer-events-none"
                style={{ color: '#a0a0c0' }}
              >
                TAP to jump
              </div>
            )}
          </div>
        </div>
      )}

      {/* Spin animation for stars */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
