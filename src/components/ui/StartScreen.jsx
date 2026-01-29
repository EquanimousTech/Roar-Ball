function StartScreen({ onStart }) {
    return (
        <div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-cover bg-center"
            style={{
                backgroundImage: "url('/start-screen-bg.png')",
                backgroundColor: "#1a0a3a",
            }}
        >
            <button
                onClick={onStart}
                className="absolute top-[55%] px-14 py-5 text-3xl md:text-4xl font-extrabold uppercase tracking-wider rounded-full cursor-pointer transition-transform active:scale-95 hover:scale-105"
                style={{
                    background: `
      linear-gradient(
        180deg,
        #fff6a3 0%,
        #ffd400 30%,
        #ffb300 60%,
        #ff8c00 100%
      )
    `,
                    color: "#1f4d2b",
                    textShadow: "0 2px 0 rgba(255,255,255,0.4), 0 -2px 0 rgba(0,0,0,0.2)",
                    border: "3px solid #ff9f00",
                    boxShadow: `
      0 10px 0 #cc6f00,
      0 16px 25px rgba(0,0,0,0.5),
      inset 0 4px 6px rgba(255,255,255,0.6),
      inset 0 -4px 6px rgba(0,0,0,0.25)
    `,
                }}
            >
                PLAY NOW
            </button>


            <div className="absolute bottom-10 flex items-center gap-1">
                <img src="/Subway Hi-Res Logo.png.png" alt="Subway" className="h-9 object-contain" />
                <img src="/Goat_GER_4C_Fin1.png" alt="GOAT" className="h-22 object-contain" />
            </div>
        </div>
    );
}

export default StartScreen;