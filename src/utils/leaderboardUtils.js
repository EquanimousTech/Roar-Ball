const LEADERBOARD_KEY = "basketball_leaderboard";
const MAX_ENTRIES = 10;

// Get leaderboard from localStorage
export const getLeaderboard = () => {
    try {
        const data = localStorage.getItem(LEADERBOARD_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error("Error reading leaderboard:", error);
        return [];
    }
};

// Save a new score to the leaderboard
export const saveScore = (playerName, score, bestStreak) => {
    try {
        const leaderboard = getLeaderboard();

        const newEntry = {
            id: Date.now(),
            name: playerName.trim() || "Anonymous",
            score,
            bestStreak,
            date: new Date().toISOString(),
        };

        leaderboard.push(newEntry);

        // Sort by score (highest first), then by date (newest first)
        leaderboard.sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return new Date(b.date) - new Date(a.date);
        });

        // Keep only top entries
        const trimmedLeaderboard = leaderboard.slice(0, MAX_ENTRIES);

        localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(trimmedLeaderboard));

        // Return the rank of the new entry (1-indexed)
        const rank = trimmedLeaderboard.findIndex(entry => entry.id === newEntry.id) + 1;
        return rank > 0 && rank <= MAX_ENTRIES ? rank : null;
    } catch (error) {
        console.error("Error saving score:", error);
        return null;
    }
};

// Check if a score would make the leaderboard
export const isHighScore = (score) => {
    const leaderboard = getLeaderboard();
    if (leaderboard.length < MAX_ENTRIES) return true;
    return score > leaderboard[leaderboard.length - 1].score;
};

// Clear leaderboard (for testing)
export const clearLeaderboard = () => {
    localStorage.removeItem(LEADERBOARD_KEY);
};

// Get rank for a specific score
export const getRankForScore = (score) => {
    const leaderboard = getLeaderboard();
    const rank = leaderboard.filter(entry => entry.score > score).length + 1;
    return rank;
};