import { useState, useEffect, useRef } from "react";

function LoadingScreen({ onLoadingComplete, minimumLoadTime = 3000 }) {
    const [progress, setProgress] = useState(0);
    const [assetsLoaded, setAssetsLoaded] = useState(false);
    const [minimumTimePassed, setMinimumTimePassed] = useState(false);
    const [videoLoaded, setVideoLoaded] = useState(false);
    const videoRef = useRef(null);

    // Simulate loading progress
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                const increment = Math.max(1, (100 - prev) * 0.1);
                return Math.min(prev + increment, assetsLoaded ? 100 : 90);
            });
        }, 100);

        return () => clearInterval(interval);
    }, [assetsLoaded]);

    // Minimum load time
    useEffect(() => {
        const timer = setTimeout(() => {
            setMinimumTimePassed(true);
        }, minimumLoadTime);

        return () => clearTimeout(timer);
    }, [minimumLoadTime]);

    // Preload game assets
    useEffect(() => {
        const preloadAssets = async () => {
            const imagesToLoad = [
                "/inputBg.jpg",
                "/bgNew2.png",
                "/subway-logo.png",
                "/goat-logo.png",
            ];

            const imagePromises = imagesToLoad.map((src) => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.onload = resolve;
                    img.onerror = resolve;
                    img.src = src;
                });
            });

            await Promise.all(imagePromises);
            setAssetsLoaded(true);
        };

        preloadAssets();
    }, []);

    // Complete loading when all conditions are met
    useEffect(() => {
        if (progress >= 100 && minimumTimePassed && assetsLoaded) {
            const timer = setTimeout(() => {
                onLoadingComplete();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [progress, minimumTimePassed, assetsLoaded, onLoadingComplete]);

    return (
        <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-black overflow-hidden">
            {/* Video Background */}
            <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                onLoadedData={() => setVideoLoaded(true)}
                className="absolute inset-0 w-full h-full object-cover opacity-80"
            >
                <source src="/loading-video.mp4" type="video/mp4" />
            </video>

            {/* Fallback animated background */}
            <div
                className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-black transition-opacity duration-500"
                style={{ opacity: videoLoaded ? 0 : 1 }}
            >
                <div className="absolute inset-0 overflow-hidden">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div
                            key={i}
                            className="absolute rounded-full bg-orange-500/30 animate-pulse"
                            style={{
                                width: Math.random() * 100 + 50,
                                height: Math.random() * 100 + 50,
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 2}s`,
                                animationDuration: `${2 + Math.random() * 3}s`,
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Content - Center (for title, basketball animation, etc.) */}
            <div className="relative z-10 flex flex-col items-center">
                {/* Title */}
                {/* <div className="mb-8 text-center">
            <div className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400 mb-2">
                🏀 HOOPS
            </div>
            <div className="text-xl md:text-2xl text-purple-300 font-bold tracking-widest">
                ARCADE
            </div>
        </div> */}

                {/* Basketball Animation */}
                {/* <div className="mb-8 relative">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 animate-bounce shadow-lg shadow-orange-500/50">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-0.5 bg-orange-800/50 absolute"></div>
                    <div className="w-0.5 h-full bg-orange-800/50 absolute"></div>
                    <div className="w-[90%] h-[90%] border-2 border-orange-800/50 rounded-full absolute"></div>
                </div>
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-4 bg-black/30 rounded-full blur-sm animate-pulse"></div>
        </div> */}

                {/* Loading Tips */}
                {/* <div className="mt-8 text-gray-500 text-sm text-center max-w-xs">
            <LoadingTip />
        </div> */}
            </div>

            {/* Bottom Loading Section */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
                {/* Loading Bar */}
                <div className="w-64 md:w-80 mb-4">
                    <div className="h-3 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                        <div
                            className="h-full bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 transition-all duration-300 ease-out rounded-full"
                            style={{
                                width: `${progress}%`,
                                boxShadow: "0 0 20px rgba(255, 165, 0, 0.5)",
                            }}
                        />
                    </div>
                </div>

                {/* Loading Text */}
                <div className="text-white text-lg font-bold mb-2">
                    {progress < 100 ? "LOADING..." : "READY!"}
                </div>
                <div className="text-gray-400 text-sm">
                    {Math.round(progress)}%
                </div>
            </div>
        </div>
    );
}

// function LoadingTip() {
//     const tips = [
//         "💡 Swipe up to shoot the ball!",
//         "🔥 Build streaks for bonus points!",
//         "🎯 Aim for the center of the hoop!",
//         "⚡ Quick taps = quick shots!",
//         "🏆 Beat your high score!",
//     ];

//     const [currentTip, setCurrentTip] = useState(0);

//     useEffect(() => {
//         const interval = setInterval(() => {
//             setCurrentTip((prev) => (prev + 1) % tips.length);
//         }, 2500);
//         return () => clearInterval(interval);
//     }, []);

//     return <div className="animate-pulse">{tips[currentTip]}</div>;
// }

export default LoadingScreen;