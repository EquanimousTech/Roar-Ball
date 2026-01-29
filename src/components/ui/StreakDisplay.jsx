import { useState, useEffect, useRef } from "react";
import { getStreakTier } from "../../utils/streakUtils";

function StreakDisplay({ streak, bestStreak, showStreakLost, lostStreak }) {
    const tier = getStreakTier(streak);
    const [isAnimating, setIsAnimating] = useState(false);
    const prevStreakRef = useRef(streak);

    useEffect(() => {
        if (streak > prevStreakRef.current && streak >= 2) {
            setIsAnimating(true);
            setTimeout(() => setIsAnimating(false), 500);
        }
        prevStreakRef.current = streak;
    }, [streak]);

    if (streak < 2 && !showStreakLost) return null;

    return (
        <div className="fixed left-1/2 top-[15%] -translate-x-1/2 z-20 pointer-events-none">
            {/* Streak Lost Notification */}
            {showStreakLost && lostStreak >= 2 && (
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 animate-fade-out">
                    <div className="bg-red-900/80 px-4 py-2 rounded-lg border border-red-500">
                        <span className="text-red-400 text-sm font-bold">
                            💔 {lostStreak} STREAK LOST!
                        </span>
                    </div>
                </div>
            )}

            {/* Main Streak Display - Add your streak UI here */}
        </div>
    );
}

export default StreakDisplay;