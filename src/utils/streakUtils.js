import { STREAK_TIERS } from "../constants/gameConstants";

export const getStreakTier = (streak) => {
    for (let i = STREAK_TIERS.length - 1; i >= 0; i--) {
        if (streak >= STREAK_TIERS[i].min) {
            return STREAK_TIERS[i];
        }
    }
    return STREAK_TIERS[0];
};

export const getBallColor = (streak) => {
    if (streak >= 10) return "#ff00ff";
    if (streak >= 7) return "#ff3333";
    if (streak >= 5) return "#ff6600";
    if (streak >= 3) return "#ffaa00";
    return "orange";
};