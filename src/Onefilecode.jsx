// import { Canvas, useFrame, useThree } from "@react-three/fiber";
// import { useRef, useState, useEffect } from "react";
// import * as THREE from "three";

// // ============== CONSTANTS ==============
// const GRAVITY = -15;
// const HOOP_POS = new THREE.Vector3(0, 1.5, -2);
// const BALL_START = new THREE.Vector3(0, 0, 4);
// const BALL_RADIUS = 0.24;
// const HOOP_RADIUS = 0.45;
// const GAME_DURATION = 60;
// const BALL_POOL_SIZE = 3;

// // Back wall position (behind the hoop)
// const BACK_WALL_Z = HOOP_POS.z - 1.5;
// const SIDE_WALL_X = 3;

// // Streak tiers configuration
// const STREAK_TIERS = [
//   { min: 0, name: "", color: "text-white", bgColor: "from-gray-500 to-gray-600", multiplier: 1 },
//   { min: 2, name: "NICE!", color: "text-yellow-400", bgColor: "from-yellow-500 to-yellow-600", multiplier: 1.5, icon: "👍" },
//   { min: 3, name: "HOT!", color: "text-orange-400", bgColor: "from-orange-500 to-red-500", multiplier: 2, icon: "🔥" },
//   { min: 5, name: "ON FIRE!", color: "text-orange-500", bgColor: "from-red-500 to-orange-500", multiplier: 2.5, icon: "🔥🔥" },
//   { min: 7, name: "UNSTOPPABLE!", color: "text-red-500", bgColor: "from-red-600 to-pink-500", multiplier: 3, icon: "💥" },
//   { min: 10, name: "LEGENDARY!", color: "text-purple-400", bgColor: "from-purple-600 to-pink-500", multiplier: 4, icon: "⭐" },
//   { min: 15, name: "GODLIKE!", color: "text-cyan-400", bgColor: "from-cyan-500 to-purple-500", multiplier: 5, icon: "👑" },
// ];

// const getStreakTier = (streak) => {
//   for (let i = STREAK_TIERS.length - 1; i >= 0; i--) {
//     if (streak >= STREAK_TIERS[i].min) {
//       return STREAK_TIERS[i];
//     }
//   }
//   return STREAK_TIERS[0];
// };

// // ============== SINGLE BALL COMPONENT ==============
// function Ball({ id, throwData, onScore, onBallStopped, gameActive }) {
//   const meshRef = useRef();
//   const velocity = useRef(new THREE.Vector3(0, 0, 0));
//   const ballState = useRef("idle");
//   const hasScored = useRef(false);

//   const resetBall = () => {
//     if (!meshRef.current) return;
//     meshRef.current.position.set(BALL_START.x, BALL_START.y, BALL_START.z);
//     meshRef.current.visible = false;
//     velocity.current.set(0, 0, 0);
//     ballState.current = "idle";
//     hasScored.current = false;
//   };

//   useEffect(() => {
//     if (!throwData || !meshRef.current || !gameActive) return;
//     if (throwData.ballId !== id) return;

//     meshRef.current.position.set(BALL_START.x, BALL_START.y, BALL_START.z);
//     meshRef.current.visible = true;
//     velocity.current.set(throwData.x, throwData.y, throwData.z);
//     ballState.current = "flying";
//     hasScored.current = false;
//   }, [throwData, id, gameActive]);

//   useFrame((state, delta) => {
//     if (!meshRef.current) return;

//     const ball = meshRef.current;
//     const pos = ball.position;
//     const vel = velocity.current;

//     if (ballState.current === "idle" || ballState.current === "stopped") {
//       ball.visible = false;
//       return;
//     }

//     if (ballState.current === "ready") {
//       pos.x = BALL_START.x;
//       pos.y = BALL_START.y + Math.sin(state.clock.elapsedTime * 3 + id) * 0.05;
//       pos.z = BALL_START.z;
//       ball.rotation.y += delta * 0.5;
//       ball.visible = true;
//       return;
//     }

//     if (ballState.current === "passing") {
//       const dt = Math.min(delta, 0.05);
//       vel.y += GRAVITY * dt;
//       pos.y += vel.y * dt;
//       pos.x += vel.x * dt * 0.3;
//       pos.z += vel.z * dt * 0.3;

//       if (pos.y < HOOP_POS.y - 1.0) {
//         ballState.current = "stopped";
//         ball.visible = false;
//         onBallStopped?.(id, "scored");
//       }
//       return;
//     }

//     if (ballState.current !== "flying") return;

//     const dt = Math.min(delta, 0.05);
//     const prevY = pos.y;

//     vel.y += GRAVITY * dt;

//     pos.x += vel.x * dt;
//     pos.y += vel.y * dt;
//     pos.z += vel.z * dt;

//     ball.rotation.x += vel.z * dt * 2;
//     ball.rotation.z -= vel.x * dt * 2;

//     if (pos.z < BACK_WALL_Z + BALL_RADIUS) {
//       pos.z = BACK_WALL_Z + BALL_RADIUS;
//       vel.z *= -0.6;
//       vel.x *= 0.8;
//       vel.y *= 0.9;
//     }

//     if (pos.x > SIDE_WALL_X - BALL_RADIUS) {
//       pos.x = SIDE_WALL_X - BALL_RADIUS;
//       vel.x *= -0.6;
//     }
//     if (pos.x < -SIDE_WALL_X + BALL_RADIUS) {
//       pos.x = -SIDE_WALL_X + BALL_RADIUS;
//       vel.x *= -0.6;
//     }

//     if (!hasScored.current && vel.y < 0) {
//       const distToHoopCenter = Math.sqrt(
//         (pos.x - HOOP_POS.x) ** 2 + (pos.z - HOOP_POS.z) ** 2
//       );

//       const isInsideRim = distToHoopCenter < HOOP_RADIUS - BALL_RADIUS * 0.5;
//       const crossedHoopPlane = prevY >= HOOP_POS.y && pos.y < HOOP_POS.y;

//       if (isInsideRim && crossedHoopPlane) {
//         hasScored.current = true;
//         ballState.current = "passing";
//         onScore?.(id);
//         return;
//       }
//     }

//     const toHoopX = pos.x - HOOP_POS.x;
//     const toHoopZ = pos.z - HOOP_POS.z;
//     const distFromCenter = Math.sqrt(toHoopX * toHoopX + toHoopZ * toHoopZ);

//     if (Math.abs(pos.y - HOOP_POS.y) < BALL_RADIUS + 0.05) {
//       const rimInnerEdge = HOOP_RADIUS - 0.03;
//       const rimOuterEdge = HOOP_RADIUS + 0.03;

//       if (
//         distFromCenter > rimInnerEdge - BALL_RADIUS &&
//         distFromCenter < rimOuterEdge + BALL_RADIUS
//       ) {
//         const nx = toHoopX / (distFromCenter || 1);
//         const nz = toHoopZ / (distFromCenter || 1);

//         if (distFromCenter > HOOP_RADIUS) {
//           vel.x += nx * 3;
//           vel.z += nz * 3;
//         } else {
//           vel.x -= nx * 2;
//           vel.z -= nz * 2;
//         }

//         vel.y *= -0.4;
//         vel.x *= 0.6;
//         vel.z *= 0.6;
//       }
//     }

//     const backboardZ = HOOP_POS.z - HOOP_RADIUS - 0.2;
//     if (
//       pos.z < backboardZ + BALL_RADIUS &&
//       pos.z > backboardZ - 0.1 &&
//       Math.abs(pos.x - HOOP_POS.x) < 0.7 &&
//       pos.y > HOOP_POS.y - 0.3 &&
//       pos.y < HOOP_POS.y + 0.9
//     ) {
//       vel.z *= -0.5;
//       pos.z = backboardZ + BALL_RADIUS + 0.01;
//     }

//     const floorY = -1.5 + BALL_RADIUS;
//     if (pos.y < floorY) {
//       pos.y = floorY;
//       vel.y *= -0.5;
//       vel.x *= 0.7;
//       vel.z *= 0.7;

//       const speed = Math.sqrt(vel.x ** 2 + vel.y ** 2 + vel.z ** 2);
//       if (speed < 0.5) {
//         vel.set(0, 0, 0);
//         ballState.current = "stopped";
//         ball.visible = false;
//         onBallStopped?.(id, "missed");
//         return;
//       }
//     }

//     if (pos.y < -5 || pos.z > 15 || Math.abs(pos.x) > 15) {
//       ballState.current = "stopped";
//       ball.visible = false;
//       onBallStopped?.(id, "missed");
//       return;
//     }
//   });

//   return (
//     <mesh
//       ref={meshRef}
//       position={[BALL_START.x, BALL_START.y, BALL_START.z]}
//       visible={false}
//       castShadow
//     >
//       <sphereGeometry args={[BALL_RADIUS, 32, 32]} />
//       <meshStandardMaterial color="orange" roughness={0.7} />
//       <mesh rotation={[0, 0, Math.PI / 2]}>
//         <torusGeometry args={[BALL_RADIUS * 0.99, 0.012, 8, 32]} />
//         <meshBasicMaterial color="#8B4513" />
//       </mesh>
//       <mesh rotation={[Math.PI / 2, 0, 0]}>
//         <torusGeometry args={[BALL_RADIUS * 0.99, 0.012, 8, 32]} />
//         <meshBasicMaterial color="#8B4513" />
//       </mesh>
//     </mesh>
//   );
// }

// // ============== ACTIVE BALL ==============
// function ActiveBall({ isVisible, streak }) {
//   const meshRef = useRef();
//   const tier = getStreakTier(streak);

//   useFrame((state, delta) => {
//     if (!meshRef.current || !isVisible) return;

//     const ball = meshRef.current;
//     ball.position.x = BALL_START.x;
//     ball.position.y = BALL_START.y + Math.sin(state.clock.elapsedTime * 3) * 0.05;
//     ball.position.z = BALL_START.z;
//     ball.rotation.y += delta * (0.5 + streak * 0.1);
//   });

//   // Ball color changes based on streak
//   const getBallColor = () => {
//     if (streak >= 10) return "#ff00ff";
//     if (streak >= 7) return "#ff3333";
//     if (streak >= 5) return "#ff6600";
//     if (streak >= 3) return "#ffaa00";
//     return "orange";
//   };

//   return (
//     <group>
//       <mesh
//         ref={meshRef}
//         position={[BALL_START.x, BALL_START.y, BALL_START.z]}
//         visible={isVisible}
//         castShadow
//       >
//         <sphereGeometry args={[BALL_RADIUS, 32, 32]} />
//         <meshStandardMaterial
//           color={getBallColor()}
//           roughness={0.7}
//           emissive={streak >= 3 ? getBallColor() : "black"}
//           emissiveIntensity={streak >= 3 ? 0.3 : 0}
//         />
//         <mesh rotation={[0, 0, Math.PI / 2]}>
//           <torusGeometry args={[BALL_RADIUS * 0.99, 0.012, 8, 32]} />
//           <meshBasicMaterial color="#8B4513" />
//         </mesh>
//         <mesh rotation={[Math.PI / 2, 0, 0]}>
//           <torusGeometry args={[BALL_RADIUS * 0.99, 0.012, 8, 32]} />
//           <meshBasicMaterial color="#8B4513" />
//         </mesh>
//       </mesh>
//     </group>
//   );
// }

// // ============== COURT/ENVIRONMENT COMPONENT ==============
// function Court() {
//   return (
//     <>
//       <group position={[HOOP_POS.x, HOOP_POS.y, HOOP_POS.z]}>
//         <mesh rotation={[Math.PI / 2, 0, 0]}>
//           <torusGeometry args={[HOOP_RADIUS, 0.03, 16, 32]} />
//           <meshStandardMaterial color="#a270ff" metalness={0.8} roughness={0.3} />
//         </mesh>
//         <mesh position={[0, -0.35, 0]}>
//           <cylinderGeometry args={[HOOP_RADIUS - 0.05, 0.12, 0.55, 12, 6, true]} />
//           <meshBasicMaterial color="white" wireframe transparent opacity={0.7} />
//         </mesh>
//         <mesh position={[0, 0, -HOOP_RADIUS - 0.1]}>
//           <boxGeometry args={[0.06, 0.06, 0.25]} />
//           <meshStandardMaterial color="#221666" metalness={0.7} />
//         </mesh>
//       </group>

//       <mesh position={[HOOP_POS.x, HOOP_POS.y + 0.4, HOOP_POS.z - HOOP_RADIUS - 0.2]}>
//         <boxGeometry args={[1.4, 1, 0.08]} />
//         <meshStandardMaterial color="white" transparent opacity={0} />
//       </mesh>
//       <lineSegments position={[HOOP_POS.x, HOOP_POS.y + 0.4, HOOP_POS.z - HOOP_RADIUS - 0.15]}>
//         <edgesGeometry args={[new THREE.BoxGeometry(1.4, 1, 0.08)]} />
//         <lineBasicMaterial color="#a270ff" />
//       </lineSegments>
//       <mesh position={[HOOP_POS.x, HOOP_POS.y + 0.25, HOOP_POS.z - HOOP_RADIUS - 0.15]}>
//         <planeGeometry args={[0.5, 0.4]} />
//         <meshBasicMaterial color="#a270ff" transparent opacity={0} side={THREE.DoubleSide} />
//       </mesh>

//       <mesh position={[0, 1, BACK_WALL_Z]} visible={false}>
//         <boxGeometry args={[10, 8, 0.2]} />
//         <meshBasicMaterial color="blue" transparent opacity={0} />
//       </mesh>

//       <mesh position={[SIDE_WALL_X, 1, -2]} visible={false}>
//         <boxGeometry args={[0.2, 8, 10]} />
//         <meshBasicMaterial color="red" transparent opacity={0.1} />
//       </mesh>
//       <mesh position={[-SIDE_WALL_X, 1, -2]} visible={false}>
//         <boxGeometry args={[0.2, 8, 10]} />
//         <meshBasicMaterial color="red" transparent opacity={0.1} />
//       </mesh>
//     </>
//   );
// }

// // ============== GAME SCENE COMPONENT ==============
// function GameScene({ throwData, onScore, onBallStopped, gameActive, showActiveBall, streak }) {
//   return (
//     <>
//       <ActiveBall isVisible={showActiveBall && gameActive} streak={streak} />

//       {Array.from({ length: BALL_POOL_SIZE }).map((_, index) => (
//         <Ball
//           key={index}
//           id={index}
//           throwData={throwData}
//           onScore={onScore}
//           onBallStopped={onBallStopped}
//           gameActive={gameActive}
//         />
//       ))}

//       <Court />
//     </>
//   );
// }

// // ============== START SCREEN COMPONENT ==============
// function StartScreen({ onStart }) {
//   return (
//     <div
//       className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-cover bg-center"
//       style={{
//         backgroundImage: "url('/start-screen-bg.png')",
//         backgroundColor: "#1a0a3a",
//       }}
//     >
//       <button
//         onClick={onStart}
//         className="absolute top-[55%] px-12 py-5 text-2xl md:text-4xl font-bold text-gray-800 uppercase tracking-wider rounded-full cursor-pointer transition-transform active:scale-95 hover:scale-105 shadow-xl"
//         style={{
//           background: "linear-gradient(180deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)",
//           boxShadow: "0 6px 20px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.3)",
//         }}
//       >
//         PLAY NOW
//       </button>

//       <div className="absolute bottom-10 flex items-center gap-8">
//         <img src="/subway-logo.png" alt="Subway" className="h-10 object-contain" />
//         <img src="/goat-logo.png" alt="GOAT" className="h-10 object-contain" />
//       </div>
//     </div>
//   );
// }

// // ============== STREAK DISPLAY COMPONENT ==============
// function StreakDisplay({ streak, bestStreak, showStreakLost, lostStreak }) {
//   const tier = getStreakTier(streak);
//   const [isAnimating, setIsAnimating] = useState(false);
//   const prevStreakRef = useRef(streak);

//   useEffect(() => {
//     if (streak > prevStreakRef.current && streak >= 2) {
//       setIsAnimating(true);
//       setTimeout(() => setIsAnimating(false), 500);
//     }
//     prevStreakRef.current = streak;
//   }, [streak]);

//   if (streak < 2 && !showStreakLost) return null;

//   return (
//     <div className="fixed left-1/2 top-[15%] -translate-x-1/2 z-20 pointer-events-none">
//       {/* Streak Lost Notification */}
//       {showStreakLost && lostStreak >= 2 && (
//         <div className="absolute -top-16 left-1/2 -translate-x-1/2 animate-fade-out">
//           <div className="bg-red-900/80 px-4 py-2 rounded-lg border border-red-500">
//             <span className="text-red-400 text-sm font-bold">
//               💔 {lostStreak} STREAK LOST!
//             </span>
//           </div>
//         </div>
//       )}

//       {/* Main Streak Display */}
    
//     </div>
//   );
// }

// // ============== MILESTONE CELEBRATION ==============
// function MilestoneCelebration({ milestone, onComplete,showPoints }) {
//   useEffect(() => {
//     const timer = setTimeout(onComplete, 2000);
//     return () => clearTimeout(timer);
//   }, [onComplete]);

//   if (!milestone) return null;

//   return (
//     <div className={`fixed inset-0 pointer-events-none z-30 flex items-center justify-center transition-all duration-300 ${showPoints ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}>
//       <div className="animate-milestone-pop">
//         <div className="text-center">
//           <div className="text-6xl md:text-8xl mb-2 animate-bounce">
//             {milestone.icon}
//           </div>
//           <div
//             className={`text-3xl md:text-5xl font-black uppercase ${milestone.color}`}
//             style={{
//               textShadow: "0 0 30px currentColor, 0 0 60px currentColor",
//             }}
//           >
//             {milestone.name}
//           </div>
//           <div className="text-xl md:text-2xl text-yellow-400 font-bold mt-2">
//             {milestone.streak} IN A ROW!
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ============== GAMEPLAY UI COMPONENT ==============
// function GameplayUI({ score, timeLeft, lastPoints, showPoints, streak, bestStreak }) {
//   return (
//     <>
//       <div className="fixed top-0 left-0 right-0 flex justify-between items-start px-5 py-4 pointer-events-none z-10">
//         {/* Score Section */}
//         <div className="flex flex-col items-start">
//           <span className="text-gray-400 text-xs md:text-sm font-bold uppercase tracking-wide">
//             SCORE
//           </span>
//           <span
//             className="text-green-400 text-4xl md:text-6xl font-bold font-mono leading-none"
//             style={{ textShadow: "0 0 10px rgba(0,255,0,0.5)" }}
//           >
//             {score}
//           </span>
//           {/* Best Streak indicator */}
//           <div className="flex items-center gap-1 mt-1">
//             <span className="text-gray-500 text-xs">Best:</span>
//             <span className="text-orange-400 text-xs font-bold">{bestStreak}🔥</span>
//           </div>
//         </div>

//         {/* Points Popup (Center) */}
//         <div
//           className={`flex flex-col items-center transition-all duration-300 ${showPoints ? "opacity-100 scale-100" : "opacity-0 scale-50"
//             }`}
//         >
//           <span
//             className="text-cyan-400 text-4xl md:text-5xl font-bold font-mono"
//             style={{ textShadow: "0 0 15px rgba(0,255,255,0.8)" }}
//           >
//             +{lastPoints}
//           </span>
//           <span className="text-cyan-400 text-sm md:text-lg font-bold uppercase tracking-widest">
//             POINTS
//           </span>
//           {streak > 1 && (
//             <span className="text-yellow-400 text-xs font-bold animate-bounce">
//               STREAK BONUS!
//             </span>
//           )}
//         </div>

//         {/* Timer Section */}
//         <div className="flex flex-col items-end">
//           <span className="text-gray-400 text-xs md:text-sm font-bold uppercase tracking-wide">
//             TIME
//           </span>
//           <span
//             className={`text-4xl md:text-6xl font-bold font-mono leading-none ${timeLeft <= 10 ? "text-red-500 animate-pulse" : "text-white"
//               }`}
//             style={{
//               textShadow: timeLeft <= 10 ? "0 0 10px rgba(255,0,0,0.5)" : "none",
//             }}
//           >
//             {timeLeft}
//           </span>
//         </div>
//       </div>
//     </>
//   );
// }

// // ============== GAME OVER OVERLAY ==============
// function GameOverOverlay({ score, bestStreak, onPlayAgain }) {
//   const getMessage = () => {
//     if (score >= 50) return "🌟 Legendary Performance!";
//     if (score >= 30) return "🔥 You're On Fire!";
//     if (score >= 20) return "👍 Great Game!";
//     if (score >= 10) return "Nice Try!";
//     return "Keep Practicing!";
//   };

//   return (
//     <div className="fixed inset-0 bg-black/85 flex flex-col items-center justify-center z-50">
//       <div
//         className="px-12 py-10 rounded-3xl text-center shadow-2xl border-2 border-purple-500"
//         style={{
//           background: "linear-gradient(180deg, #2a1a4a 0%, #1a0a3a 100%)",
//         }}
//       >
//         <div className="text-3xl md:text-5xl font-bold text-orange-500 mb-3">
//           🏆 GAME OVER
//         </div>
//         <div className="text-xl md:text-2xl text-gray-400 mb-2">Final Score</div>
//         <div
//           className="text-6xl md:text-8xl font-bold text-green-400"
//           style={{ textShadow: "0 0 20px rgba(0,255,0,0.5)" }}
//         >
//           {score}
//         </div>

//         {/* Best Streak Display */}
//         <div className="mt-4 mb-6">
//           <div className="inline-flex items-center gap-2 bg-orange-900/50 px-4 py-2 rounded-full">
//             <span className="text-orange-400 text-lg">🔥</span>
//             <span className="text-orange-400 font-bold">Best Streak: {bestStreak}</span>
//           </div>
//         </div>

//         <div className="text-base md:text-xl text-gray-500 mb-8">
//           {getMessage()}
//         </div>
//         <button
//           onClick={onPlayAgain}
//           className="px-10 py-4 text-lg md:text-2xl font-bold text-gray-800 uppercase rounded-full cursor-pointer transition-transform active:scale-95 hover:scale-105 shadow-lg"
//           style={{
//             background: "linear-gradient(180deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)",
//           }}
//         >
//           PLAY AGAIN
//         </button>
//       </div>
//     </div>
//   );
// }

// // ============== MAIN APP ==============
// export default function App() {
//   const [throwData, setThrowData] = useState(null);
//   const [score, setScore] = useState(0);
//   const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
//   const [gameState, setGameState] = useState("start");
//   const [lastPoints, setLastPoints] = useState(0);
//   const [showPoints, setShowPoints] = useState(false);
//   const [showActiveBall, setShowActiveBall] = useState(true);

//   // Streak state
//   const [currentStreak, setCurrentStreak] = useState(0);
//   const [bestStreak, setBestStreak] = useState(0);
//   const [showStreakLost, setShowStreakLost] = useState(false);
//   const [lostStreak, setLostStreak] = useState(0);
//   const [currentMilestone, setCurrentMilestone] = useState(null);

//   const nextBallId = useRef(0);
//   const activeBalls = useRef(new Set());
//   const startRef = useRef({ x: 0, y: 0, time: 0 });
//   const isDragging = useRef(false);
//   const timerRef = useRef(null);

//   // Milestone thresholds
//   const milestoneThresholds = [3, 5, 7, 10, 15, 20];
//   const lastMilestoneRef = useRef(0);

//   useEffect(() => {
//     if (gameState === "playing") {
//       timerRef.current = setInterval(() => {
//         setTimeLeft((prev) => {
//           if (prev <= 1) {
//             clearInterval(timerRef.current);
//             setGameState("ended");
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);
//     }
//     return () => {
//       if (timerRef.current) clearInterval(timerRef.current);
//     };
//   }, [gameState]);

//   // Check for milestones
//   useEffect(() => {
//     if (currentStreak > lastMilestoneRef.current) {
//       const hitMilestone = milestoneThresholds.find(
//         (m) => currentStreak === m && m > lastMilestoneRef.current
//       );
//       if (hitMilestone) {
//         const tier = getStreakTier(hitMilestone);
//         setCurrentMilestone({
//           ...tier,
//           streak: hitMilestone,
//         });
//         lastMilestoneRef.current = hitMilestone;
//       }
//     }
//   }, [currentStreak]);

//   const startGame = () => {
//     setScore(0);
//     setTimeLeft(GAME_DURATION);
//     setGameState("playing");
//     setThrowData(null);
//     setLastPoints(0);
//     setShowPoints(false);
//     setShowActiveBall(true);
//     setCurrentStreak(0);
//     setBestStreak(0);
//     setShowStreakLost(false);
//     setLostStreak(0);
//     setCurrentMilestone(null);
//     lastMilestoneRef.current = 0;
//     nextBallId.current = 0;
//     activeBalls.current.clear();
//   };

//   const handleScore = (ballId) => {
//     if (gameState !== "playing") return;

//     const newStreak = currentStreak + 1;
//     setCurrentStreak(newStreak);

//     if (newStreak > bestStreak) {
//       setBestStreak(newStreak);
//     }

//     const tier = getStreakTier(newStreak);
//     const points = Math.floor(2 * tier.multiplier);

//     setScore((prev) => prev + points);
//     setLastPoints(points);
//     setShowPoints(true);
//     setShowStreakLost(false);

//     setTimeout(() => {
//       setShowPoints(false);
//     }, 1500);
//   };

//   const handleBallStopped = (ballId, reason) => {
//     if (gameState !== "playing") return;

//     activeBalls.current.delete(ballId);

//     // Only break streak on miss (not on score)
//     if (reason === "missed" && currentStreak >= 2) {
//       setLostStreak(currentStreak);
//       setShowStreakLost(true);
//       setCurrentStreak(0);
//       lastMilestoneRef.current = 0;

//       setTimeout(() => {
//         setShowStreakLost(false);
//       }, 2000);
//     } else if (reason === "missed") {
//       setCurrentStreak(0);
//       lastMilestoneRef.current = 0;
//     }
//   };

//   const handlePointerDown = (e) => {
//     if (gameState !== "playing") return;
//     startRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };
//     isDragging.current = true;
//   };

//   const handlePointerUp = (e) => {
//     if (gameState !== "playing") return;
//     if (!isDragging.current) return;
//     isDragging.current = false;

//     if (activeBalls.current.size >= BALL_POOL_SIZE) {
//       return;
//     }

//     const dx = e.clientX - startRef.current.x;
//     const dy = startRef.current.y - e.clientY;

//     let vx, vy, vz;

//     if (Math.abs(dx) < 30 && Math.abs(dy) < 30) {
//       vx = 0;
//       vy = 8;
//       vz = -10;
//     } else if (dy > 20) {
//       const power = Math.min(Math.sqrt(dx * dx + dy * dy) / 200, 1.5);
//       vx = (dx / 100) * power;
//       vy = 6 + power * 5;
//       vz = -8 - power * 4;
//     } else {
//       return;
//     }

//     const ballId = nextBallId.current % BALL_POOL_SIZE;
//     nextBallId.current++;

//     activeBalls.current.add(ballId);

//     setShowActiveBall(false);
//     setTimeout(() => {
//       setShowActiveBall(true);
//     }, 100);

//     setThrowData({
//       x: vx,
//       y: vy,
//       z: vz,
//       ballId: ballId,
//       timestamp: Date.now(),
//     });
//   };

//   return (
//     <div
//       className="w-screen h-screen m-0 p-0 overflow-hidden touch-none select-none relative"
//       onPointerDown={handlePointerDown}
//       onPointerUp={handlePointerUp}
//     >
//       {gameState === "start" && <StartScreen onStart={startGame} />}

//       {gameState !== "start" && (
//         <div
//           className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
//           style={{
//             backgroundImage: "url('/gameplay-bg.png')",
//             backgroundColor: "#1a0a3a",
//           }}
//         />
//       )}

//       <Canvas
//         camera={{ position: [0, 2, 7], fov: 55 }}
//         shadows
//         className="w-full h-full relative z-1"
//         style={{
//           background: "transparent",
//         }}
//         gl={{ alpha: true }}
//       >
//         <ambientLight intensity={0.6} />
//         <directionalLight position={[5, 10, 5]} intensity={1.0} castShadow />
//         <pointLight position={[-3, 3, 3]} intensity={0.4} color="#ffaa66" />
//         <pointLight position={[0, 5, -3]} intensity={0.3} color="#6644ff" />

//         <GameScene
//           throwData={throwData}
//           onScore={handleScore}
//           onBallStopped={handleBallStopped}
//           gameActive={gameState === "playing"}
//           showActiveBall={showActiveBall}
//           streak={currentStreak}
//         />
//       </Canvas>

//       {gameState === "playing" && (
//         <>
//           <GameplayUI
//             score={score}
//             timeLeft={timeLeft}
//             lastPoints={lastPoints}
//             showPoints={showPoints}
//             streak={currentStreak}
//             bestStreak={bestStreak}
//           />
//           <StreakDisplay
//             streak={currentStreak}
//             bestStreak={bestStreak}
//             showStreakLost={showStreakLost}
//             lostStreak={lostStreak}
//           />
//           <MilestoneCelebration
//             milestone={currentMilestone}
//             onComplete={() => setCurrentMilestone(null)}
//           />
//         </>
//       )}

//       {gameState === "ended" && (
//         <GameOverOverlay
//           score={score}
//           bestStreak={bestStreak}
//           onPlayAgain={startGame}
//         />
//       )}

//       {/* Custom CSS for animations */}
//       <style>{`
//         @keyframes float {
//           0%, 100% { transform: translateY(0) scale(1); opacity: 0.8; }
//           50% { transform: translateY(-30px) scale(1.2); opacity: 0.4; }
//           100% { transform: translateY(-50px) scale(0.8); opacity: 0; }
//         }
        
//         @keyframes glow {
//           0%, 100% { box-shadow: 0 0 20px rgba(255, 100, 0, 0.5); }
//           50% { box-shadow: 0 0 40px rgba(255, 100, 0, 0.8), 0 0 60px rgba(255, 50, 0, 0.4); }
//         }
        
//         @keyframes milestone-pop {
//           0% { transform: scale(0) rotate(-10deg); opacity: 0; }
//           50% { transform: scale(1.2) rotate(5deg); opacity: 1; }
//           70% { transform: scale(0.9) rotate(-2deg); }
//           100% { transform: scale(1) rotate(0deg); opacity: 1; }
//         }
        
//         @keyframes fade-out {
//           0% { opacity: 1; transform: translateY(0); }
//           100% { opacity: 0; transform: translateY(-20px); }
//         }
        
//         .animate-float {
//           animation: float 1s ease-out forwards;
//         }
        
//         .animate-glow {
//           animation: glow 1s ease-in-out infinite;
//         }
        
//         .animate-milestone-pop {
//           animation: milestone-pop 0.6s ease-out forwards;
//         }
        
//         .animate-fade-out {
//           animation: fade-out 2s ease-out forwards;
//         }
//       `}</style>
//     </div>
//   );
// }