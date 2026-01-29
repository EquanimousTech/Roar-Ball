import { useState, useRef, useEffect } from "react";

function NameInputScreen({ onSubmit, savedName = "" }) {
    const [name, setName] = useState(savedName);
    const [isAnimating, setIsAnimating] = useState(false);
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const inputRef = useRef(null);

    useEffect(() => {
        const handleResize = () => {
            setWindowHeight(window.innerHeight);
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        setTimeout(() => {
            inputRef.current?.focus();
        }, 500);
    }, []);

    const handleSubmit = (e) => {
        e?.preventDefault();
        if (isAnimating) return;

        setIsAnimating(true);
        const playerName = name.trim() || "Player";
        localStorage.setItem("basketball_player_name", playerName);

        setTimeout(() => {
            onSubmit(playerName);
        }, 350);
    };

    const displayName = name.trim() || "Guest";

    // Responsive values based on screen size
    const isVerySmall = windowWidth < 360;
    const isSmall = windowWidth >= 360 && windowWidth < 400;
    const isMedium = windowWidth >= 400 && windowWidth < 500;
    const isShortScreen = windowHeight < 650;

    // Dynamic styles
    const styles = {
        title: {
            fontSize: isVerySmall ? "28px" : isSmall ? "36px" : isMedium ? "42px" : "48px",
            fontWeight: 900,
            letterSpacing: "0.05em",
            color: "white",
            textAlign: "center",
        },
        input: {
            width: "100%",
            maxWidth: isVerySmall ? "260px" : isSmall ? "300px" : "340px",
            height: isVerySmall ? "44px" : isSmall ? "48px" : "52px",
            marginTop: isShortScreen ? "30px" : isVerySmall ? "40px" : "50px",
            borderRadius: "12px",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            padding: "0 16px",
            fontSize: isVerySmall ? "14px" : "16px",
            color: "white",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            outline: "none",
        },
        button: {
            width: "100%",
            maxWidth: isVerySmall ? "260px" : isSmall ? "300px" : "340px",
            height: isVerySmall ? "44px" : isSmall ? "48px" : "52px",
            marginTop: isShortScreen ? "20px" : isVerySmall ? "28px" : "36px",
            borderRadius: "12px",
            fontWeight: 700,
            fontSize: isVerySmall ? "13px" : isSmall ? "14px" : "16px",
            color: "white",
            letterSpacing: "0.05em",
            background: "linear-gradient(180deg, #f97316 0%, #ea580c 100%)",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(249, 115, 22, 0.4)",
        },
        topSection: {
            paddingTop: isShortScreen ? "24px" : isVerySmall ? "32px" : "48px",
        },
        bottomSpacer: {
            height: isShortScreen ? "32px" : isVerySmall ? "48px" : "64px",
        },
    };

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 50,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundImage: "url('/inputBg.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundColor: "#221447",
                minHeight: "100vh",
                minHeight: "100dvh", // Dynamic viewport height for mobile browsers
            }}
        >
            {/* Overlay */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                }}
            />

            {/* ==================== TOP LOGOS ==================== */}
            <div
                style={{
                    ...styles.topSection,
                    position: "relative",
                    zIndex: 10,
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "4px",
                }}
            >
                {/* <img src="/Subway Hi-Res Logo.png.png" alt="Subway" style={{ height: "44px", objectFit: "contain" }} />
                <img src="/Goat_GER_4C_Fin1.png" alt="GOAT" style={{ height: "104px", objectFit: "contain" }} /> */}
            </div>

            {/* ==================== CENTER CONTENT ==================== */}
            <div
                style={{
                    position: "relative",
                    zIndex: 10,
                    width: "100%",
                    padding: isVerySmall ? "0 16px" : "0 24px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    transition: "all 0.3s ease",
                    opacity: isAnimating ? 0 : 1,
                    transform: isAnimating ? "translateY(24px)" : "translateY(0)",
                }}
            >
                {/* GAME TITLE */}
                <h1 style={styles.title}>ROAR BALL</h1>

                {/* INPUT FIELD */}
                <input
                    ref={inputRef}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value.slice(0, 15))}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                    placeholder="Enter your name"
                    style={styles.input}
                    onFocus={(e) => {
                        e.target.style.borderColor = "#f97316";
                        e.target.style.boxShadow = "0 0 0 3px rgba(249, 115, 22, 0.3)";
                    }}
                    onBlur={(e) => {
                        e.target.style.borderColor = "rgba(255, 255, 255, 0.2)";
                        e.target.style.boxShadow = "none";
                    }}
                />

                {/* PLAY BUTTON */}
                <button
                    onClick={handleSubmit}
                    style={styles.button}
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
                    {`PLAY AS ${displayName.toUpperCase()}`}
                </button>
            </div>

            {/* ==================== BOTTOM SPACER ==================== */}
            <div
                style={{
                    ...styles.bottomSpacer,
                    position: "relative",
                    zIndex: 10,
                }}
            />
        </div>
    );
}

export default NameInputScreen;