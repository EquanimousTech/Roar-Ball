import * as THREE from "three";

// ============== GAME CONSTANTS ==============
export const GRAVITY = -15;
export const HOOP_POS = new THREE.Vector3(0, 1.5, -2);
export const BALL_START = new THREE.Vector3(0, 0.3, 4);
export const BALL_RADIUS = 0.24;
export const HOOP_RADIUS = 0.4;
export const GAME_DURATION = 60;
export const BALL_POOL_SIZE = 5;

// Back wall position (behind the hoop)
export const BACK_WALL_Z = HOOP_POS.z - 1.5;
export const SIDE_WALL_X = 3;

// Streak tiers configuration
export const STREAK_TIERS = [
    { min: 0, name: "", color: "text-white", bgColor: "from-gray-500 to-gray-600", multiplier: 1 },
    { min: 2, name: "NICE!", color: "text-yellow-400", bgColor: "from-yellow-500 to-yellow-600", multiplier: 1.5, icon: "👍" },
    { min: 3, name: "KEEP IT UP!", color: "text-orange-400", bgColor: "from-orange-500 to-red-500", multiplier: 2, icon: "🔥" },
    { min: 5, name: "ON FIRE!", color: "text-orange-500", bgColor: "from-red-500 to-orange-500", multiplier: 2.5, icon: "🔥🔥" },
    { min: 7, name: "UNSTOPPABLE!", color: "text-red-500", bgColor: "from-red-600 to-pink-500", multiplier: 3, icon: "💥" },
    { min: 10, name: "LEGENDARY!", color: "text-purple-400", bgColor: "from-purple-600 to-pink-500", multiplier: 4, icon: "⭐" },
    { min: 15, name: "GODLIKE!", color: "text-cyan-400", bgColor: "from-cyan-500 to-purple-500", multiplier: 5, icon: "👑" },
];

// Milestone thresholds
export const MILESTONE_THRESHOLDS = [3, 5, 7, 10, 15, 20];