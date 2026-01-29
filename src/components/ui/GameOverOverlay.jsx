import { useState, useEffect } from "react";
import Leaderboard from "./Leaderboard";
import { saveScore, isHighScore } from "../../utils/leaderboardUtils";

function GameOverOverlay({ score, bestStreak, playerName, onPlayAgain }) {
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [newHighScoreRank, setNewHighScoreRank] = useState(null);
    const [isNewHighScore, setIsNewHighScore] = useState(false);
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWindowHeight(window.innerHeight);
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Save score and check if it's a high score
    useEffect(() => {
        const checkAndSaveScore = () => {
            const isHigh = isHighScore(score);
            setIsNewHighScore(isHigh);

            if (score > 0) {
                const rank = saveScore(playerName, score, bestStreak);
                setNewHighScoreRank(rank);
            }
        };

        checkAndSaveScore();
    }, [score, bestStreak, playerName]);

    const getMessage = () => {
        if (newHighScoreRank === 1) return "🌟 #1 - LEGENDARY!";
        if (newHighScoreRank && newHighScoreRank <= 3) return "🔥 TOP 3 FINISH!";
        if (newHighScoreRank && newHighScoreRank <= 5) return "👍 TOP 5!";
        if (score >= 50) return "🌟 Amazing Performance!";
        if (score >= 30) return "🔥 You're On Fire!";
        if (score >= 20) return "👍 Great Game!";
        if (score >= 10) return "Nice Try!";
        return "Keep Practicing!";
    };

    // Responsive values
    const isVerySmall = windowWidth < 360;
    const isSmall = windowWidth >= 360 && windowWidth < 400;
    const isShortScreen = windowHeight < 650;

    const styles = {
        overlay: {
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
            padding: isVerySmall ? "12px" : "16px",
            overflowY: "auto",
        },
        card: {
            width: "100%",
            maxWidth: isVerySmall ? "300px" : isSmall ? "340px" : "400px",
            padding: isShortScreen
                ? (isVerySmall ? "20px 16px" : "24px 20px")
                : (isVerySmall ? "28px 20px" : "36px 28px"),
            borderRadius: "24px",
            textAlign: "center",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(168, 85, 247, 0.3)",
            border: "2px solid #a855f7",
            background: "linear-gradient(180deg, #2a1a4a 0%, #1a0a3a 100%)",
        },
        title: {
            fontSize: isVerySmall ? "24px" : isSmall ? "28px" : "32px",
            fontWeight: 800,
            color: "#f97316",
            marginBottom: isShortScreen ? "4px" : "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
        },
        subtitle: {
            fontSize: isVerySmall ? "14px" : "16px",
            color: "#9ca3af",
            marginBottom: isShortScreen ? "4px" : "8px",
        },
        score: {
            fontSize: isVerySmall ? "56px" : isSmall ? "68px" : "80px",
            fontWeight: 800,
            color: isNewHighScore ? "#facc15" : "#4ade80",
            textShadow: isNewHighScore
                ? "0 0 30px rgba(255, 215, 0, 0.8), 0 0 60px rgba(255, 215, 0, 0.4)"
                : "0 0 20px rgba(74, 222, 128, 0.5)",
            lineHeight: 1,
            marginBottom: isShortScreen ? "8px" : "12px",
            animation: isNewHighScore ? "pulse 2s infinite" : "none",
        },
        streakBadge: {
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "rgba(154, 52, 18, 0.5)",
            padding: isVerySmall ? "8px 16px" : "10px 20px",
            borderRadius: "50px",
            marginBottom: isShortScreen ? "16px" : "24px",
        },
        streakText: {
            color: "#fb923c",
            fontWeight: 700,
            fontSize: isVerySmall ? "14px" : "16px",
        },
        streakIcon: {
            fontSize: isVerySmall ? "16px" : "18px",
        },
        message: {
            fontSize: isVerySmall ? "14px" : "16px",
            color: "#d1d5db",
            marginBottom: isShortScreen ? "16px" : "20px",
            fontWeight: 500,
        },
        highScoreBadge: {
            display: "inline-block",
            padding: "8px 20px",
            background: "linear-gradient(90deg, #eab308, #f97316)",
            color: "#000",
            fontWeight: 700,
            borderRadius: "50px",
            marginBottom: isShortScreen ? "12px" : "16px",
            fontSize: isVerySmall ? "12px" : "14px",
            animation: "bounce 1s infinite",
        },
        buttonContainer: {
            display: "flex",
            flexDirection: "column",
            gap: isShortScreen ? "10px" : "12px",
            width: "100%",
        },
        playAgainButton: {
            width: "100%",
            padding: isVerySmall ? "14px 24px" : "16px 32px",
            fontSize: isVerySmall ? "16px" : "18px",
            fontWeight: 700,
            color: "#1f2937",
            textTransform: "uppercase",
            borderRadius: "50px",
            cursor: "pointer",
            border: "none",
            background: "linear-gradient(180deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)",
            boxShadow: "0 4px 20px rgba(255, 165, 0, 0.4)",
            transition: "transform 0.15s ease",
            letterSpacing: "0.05em",
        },
        leaderboardButton: {
            width: "100%",
            padding: isVerySmall ? "12px 24px" : "14px 32px",
            fontSize: isVerySmall ? "14px" : "16px",
            fontWeight: 600,
            color: "#fff",
            textTransform: "uppercase",
            borderRadius: "50px",
            cursor: "pointer",
            border: "2px solid #a855f7",
            background: "linear-gradient(180deg, #7c3aed 0%, #5b21b6 100%)",
            boxShadow: "0 4px 20px rgba(168, 85, 247, 0.3)",
            transition: "transform 0.15s ease",
            letterSpacing: "0.05em",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
        },
        leaderboardModal: {
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.95)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 60,
            padding: "16px",
        },
        leaderboardContainer: {
            width: "100%",
            maxWidth: "400px",
            maxHeight: "80vh",
            overflowY: "auto",
            background: "linear-gradient(180deg, #2a1a4a 0%, #1a0a3a 100%)",
            borderRadius: "24px",
            border: "2px solid #a855f7",
            padding: isVerySmall ? "20px 16px" : "24px 20px",
        },
        leaderboardHeader: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "16px",
        },
        leaderboardTitle: {
            fontSize: isVerySmall ? "20px" : "24px",
            fontWeight: 700,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            gap: "8px",
        },
        closeButton: {
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            border: "none",
            background: "rgba(255, 255, 255, 0.1)",
            color: "#fff",
            fontSize: "20px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.2s ease",
        },
        backButton: {
            marginTop: "16px",
            width: "100%",
            padding: "12px 24px",
            fontSize: "14px",
            fontWeight: 600,
            color: "#fff",
            borderRadius: "50px",
            cursor: "pointer",
            border: "2px solid rgba(255, 255, 255, 0.2)",
            background: "transparent",
            transition: "all 0.2s ease",
        },
    };

    // CSS keyframes for animations
    const keyframesStyle = `
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
        }
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;

    return (
        <>
            <style>{keyframesStyle}</style>

            {/* Main Game Over Screen */}
            <div style={styles.overlay}>
                <div
                    style={{
                        ...styles.card,
                        animation: "slideUp 0.4s ease-out",
                    }}
                >
                    {/* Game Over Title */}
                    <div style={styles.title}>
                        <span>🏆</span>
                        <span>GAME OVER</span>
                    </div>

                    {/* Final Score Label */}
                    <div style={styles.subtitle}>Final Score</div>

                    {/* Score */}
                    <div style={styles.score}>{score}</div>

                    {/* High Score Badge */}
                    {isNewHighScore && newHighScoreRank && (
                        <div style={styles.highScoreBadge}>
                            🎉 NEW HIGH SCORE - RANK #{newHighScoreRank}! 🎉
                        </div>
                    )}

                    {/* Best Streak Display */}
                    <div style={styles.streakBadge}>
                        <span style={styles.streakIcon}>🔥</span>
                        <span style={styles.streakText}>Best Streak: {bestStreak}</span>
                    </div>

                    {/* Message */}
                    <div style={styles.message}>{getMessage()}</div>

                    {/* Buttons */}
                    <div style={styles.buttonContainer}>
                        {/* Play Again Button */}
                        <button
                            onClick={onPlayAgain}
                            style={styles.playAgainButton}
                            onTouchStart={(e) => {
                                e.currentTarget.style.transform = "scale(0.97)";
                            }}
                            onTouchEnd={(e) => {
                                e.currentTarget.style.transform = "scale(1)";
                            }}
                            onMouseDown={(e) => {
                                e.currentTarget.style.transform = "scale(0.97)";
                            }}
                            onMouseUp={(e) => {
                                e.currentTarget.style.transform = "scale(1)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "scale(1)";
                            }}
                        >
                            🎮 PLAY AGAIN
                        </button>

                        {/* Leaderboard Button */}
                        <button
                            onClick={() => setShowLeaderboard(true)}
                            style={styles.leaderboardButton}
                            onTouchStart={(e) => {
                                e.currentTarget.style.transform = "scale(0.97)";
                            }}
                            onTouchEnd={(e) => {
                                e.currentTarget.style.transform = "scale(1)";
                            }}
                            onMouseDown={(e) => {
                                e.currentTarget.style.transform = "scale(0.97)";
                            }}
                            onMouseUp={(e) => {
                                e.currentTarget.style.transform = "scale(1)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "scale(1)";
                            }}
                        >
                            <span>📊</span>
                            <span>VIEW LEADERBOARD</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Leaderboard Modal */}
            {showLeaderboard && (
                <div
                    style={{
                        ...styles.leaderboardModal,
                        animation: "slideUp 0.3s ease-out",
                    }}
                >
                    <div style={styles.leaderboardContainer}>
                        {/* Header */}
                        <div style={styles.leaderboardHeader}>
                            <div style={styles.leaderboardTitle}>
                                <span>📊</span>
                                <span>Leaderboard</span>
                            </div>
                            <button
                                style={styles.closeButton}
                                onClick={() => setShowLeaderboard(false)}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        {/* Leaderboard Component */}
                        <Leaderboard
                            currentPlayerName={playerName}
                            currentScore={score}
                            isNewHighScore={isNewHighScore}
                        />

                        {/* Back Button */}
                        <button
                            style={styles.backButton}
                            onClick={() => setShowLeaderboard(false)}
                            onMouseOver={(e) => {
                                e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.4)";
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.background = "transparent";
                                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
                            }}
                        >
                            ← Back to Results
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default GameOverOverlay;