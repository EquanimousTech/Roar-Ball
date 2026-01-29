import { useState, useEffect } from "react";
import { getLeaderboard } from "../../utils/leaderboardUtils";

function Leaderboard({ currentPlayerName, currentScore, isNewHighScore }) {
    const [leaderboard, setLeaderboard] = useState([]);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        setLeaderboard(getLeaderboard());
    }, [currentScore]);

    const displayedLeaderboard = showAll ? leaderboard : leaderboard.slice(0, 5);

    const getRankEmoji = (rank) => {
        switch (rank) {
            case 1: return "🥇";
            case 2: return "🥈";
            case 3: return "🥉";
            default: return `#${rank}`;
        }
    };

    const getRankStyle = (rank) => {
        switch (rank) {
            case 1: return "from-yellow-600/30 to-yellow-900/30 border-yellow-500";
            case 2: return "from-gray-400/30 to-gray-600/30 border-gray-400";
            case 3: return "from-orange-700/30 to-orange-900/30 border-orange-600";
            default: return "from-gray-800/30 to-gray-900/30 border-gray-700";
        }
    };

    if (leaderboard.length === 0) {
        return (
            <div className="text-center py-4">
                <div className="text-gray-500 text-sm">No high scores yet!</div>
                <div className="text-gray-600 text-xs mt-1">Be the first to set a record!</div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md">
            {/* Header */}
            <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-2xl">🏆</span>
                <h3 className="text-xl font-bold text-yellow-400 uppercase tracking-wider">
                    Leaderboard
                </h3>
                <span className="text-2xl">🏆</span>
            </div>

            {/* New High Score Badge */}
            {isNewHighScore && (
                <div className="mb-4 text-center animate-bounce">
                    <span className="inline-block px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-full text-sm">
                        ⭐ NEW HIGH SCORE! ⭐
                    </span>
                </div>
            )}

            {/* Leaderboard List */}
            <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                {displayedLeaderboard.map((entry, index) => {
                    const rank = index + 1;
                    const isCurrentPlayer =
                        entry.name === currentPlayerName &&
                        entry.score === currentScore &&
                        isNewHighScore;

                    return (
                        <div
                            key={entry.id}
                            className={`
                flex items-center gap-3 px-4 py-3 rounded-xl border transition-all
                bg-gradient-to-r ${getRankStyle(rank)}
                ${isCurrentPlayer ? "ring-2 ring-yellow-400 animate-pulse" : ""}
              `}
                        >
                            {/* Rank */}
                            <div className="w-10 text-center font-bold text-lg">
                                {getRankEmoji(rank)}
                            </div>

                            {/* Avatar */}
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${rank === 1 ? "bg-gradient-to-br from-yellow-400 to-yellow-600" :
                                        rank === 2 ? "bg-gradient-to-br from-gray-300 to-gray-500" :
                                            rank === 3 ? "bg-gradient-to-br from-orange-400 to-orange-600" :
                                                "bg-gradient-to-br from-purple-500 to-pink-500"
                                    }`}
                            >
                                {entry.name[0].toUpperCase()}
                            </div>

                            {/* Name & Streak */}
                            <div className="flex-1 min-w-0">
                                <div className={`font-bold truncate ${isCurrentPlayer ? "text-yellow-400" : "text-white"}`}>
                                    {entry.name}
                                    {isCurrentPlayer && " (YOU)"}
                                </div>
                                <div className="text-xs text-gray-500">
                                    🔥 Best Streak: {entry.bestStreak || 0}
                                </div>
                            </div>

                            {/* Score */}
                            <div className={`text-xl font-bold ${rank === 1 ? "text-yellow-400" :
                                    rank === 2 ? "text-gray-300" :
                                        rank === 3 ? "text-orange-400" :
                                            "text-green-400"
                                }`}>
                                {entry.score}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Show More/Less Button */}
            {leaderboard.length > 5 && (
                <button
                    onClick={() => setShowAll(!showAll)}
                    className="w-full mt-3 py-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                >
                    {showAll ? "Show Less ↑" : `Show All (${leaderboard.length}) ↓`}
                </button>
            )}
        </div>
    );
}

export default Leaderboard;