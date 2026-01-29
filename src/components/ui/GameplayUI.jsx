function GameplayUI({ score, timeLeft, lastPoints, showPoints, streak, bestStreak }) {
    return (
        <>
            <div className="fixed top-5 left-5 right-5 flex justify-between items-start px-5 py-4 pointer-events-none z-10">
                {/* Score Section */}
                <div className="flex flex-col center">
                    <span className="text-gray-400 text-xs md:text-sm font-bold uppercase tracking-wide">
                        SCORE
                    </span>
                    <span
                        className="text-green-400 text-4xl md:text-6xl font-bold font-mono leading-none"
                        style={{ textShadow: "0 0 10px rgba(0,255,0,0.5)" }}
                    >
                        {score}
                    </span>
                    {/* Best Streak indicator */}
                    {/* <div className="flex items-center gap-1 mt-1">
                    <span className="text-gray-500 text-xs">Best:</span>
                    <span className="text-orange-400 text-xs font-bold">{bestStreak}🔥</span>
                </div> */}
                </div>

                {/* Points Popup (Center) */}
                <div
                    className={`flex flex-col items-center transition-all duration-300 ${showPoints ? "opacity-100 scale-100" : "opacity-0 scale-50"
                        }`}
                >
                    <span
                        className="text-cyan-400 text-4xl md:text-5xl font-bold font-mono"
                        style={{ textShadow: "0 0 15px rgba(0,255,255,0.8)" }}
                    >
                        +{lastPoints}
                    </span>
                    <span className="text-cyan-400 text-sm md:text-lg font-bold uppercase tracking-widest">
                        {/* POINTS */}
                    </span>
                    {streak > 1 && (
                        <span className="text-yellow-400 text-xs font-bold animate-bounce">
                            {/* STREAK BONUS! */}
                        </span>
                    )}
                </div>

                {/* Timer Section */}
                <div className="flex flex-col items-end">
                    <span className="text-gray-400 center text-xs md:text-sm font-bold uppercase tracking-wide">
                        TIME
                    </span>
                    <span
                        className={`text-4xl md:text-6xl font-bold font-mono leading-none ${timeLeft <= 10 ? "text-red-500 animate-pulse" : "text-white"
                            }`}
                        style={{
                            textShadow: timeLeft <= 10 ? "0 0 10px rgba(255,0,0,0.5)" : "none",
                        }}
                    >
                        {timeLeft}
                    </span>
                </div>
            </div>
            <div className="top-30 relative z-10 w-full flex justify-center items-center gap-1  pt-12">
                <img src="/Subway Hi-Res Logo.png.png" alt="Subway" className="h-11 object-contain" />
                <img src="/Goat_GER_4C_Fin1.png" alt="GOAT" className="h-26 object-contain" />
            </div>
        </>
    );
}

export default GameplayUI;