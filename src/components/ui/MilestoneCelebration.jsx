import { useEffect } from "react";

function MilestoneCelebration({ milestone, onComplete, showPoints }) {
    useEffect(() => {
        const timer = setTimeout(onComplete, 2000);
        return () => clearTimeout(timer);
    }, [onComplete]);

    if (!milestone) return null;

    return (
        <div
            className={`fixed inset-0 pointer-events-none z-30 flex items-center justify-center transition-all duration-300 ${showPoints ? "opacity-100 scale-100" : "opacity-0 scale-50"
                }`}
        >
            <div className="animate-milestone-pop">
                <div className="text-center">
                    <div className="text-6xl md:text-8xl mb-2 animate-bounce">
                        {milestone.icon}
                    </div>
                    <div
                        className={`text-3xl md:text-5xl font-black uppercase ${milestone.color}`}
                        style={{
                            textShadow: "0 0 30px currentColor, 0 0 60px currentColor",
                        }}
                    >
                        {milestone.name}
                    </div>
                    {/* <div className="text-xl md:text-2xl text-yellow-400 font-bold mt-2">
                        {milestone.streak} IN A ROW!
                    </div> */}
                </div>
            </div>
        </div>
    );
}

export default MilestoneCelebration;