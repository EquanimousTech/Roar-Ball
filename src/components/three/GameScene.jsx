// import Ball from "./Ball";
// import ActiveBall from "./ActiveBall";
// import Court from "./Court";
// import { BALL_POOL_SIZE } from "../../constants/gameConstants";

// function GameScene({
//     throwData,
//     onScore,
//     onBallStopped,
//     gameActive,
//     showActiveBall,
//     streak,
//     scoreAnimation  // Add this prop
// }) {

//     return (
//         <>
//             <ActiveBall isVisible={showActiveBall && gameActive} streak={streak} />

//             {Array.from({ length: BALL_POOL_SIZE }).map((_, index) => (
//                 <Ball
//                     key={index}
//                     id={index}
//                     throwData={throwData}
//                     onScore={onScore}
//                     onBallStopped={onBallStopped}
//                     gameActive={gameActive}
//                 />
//             ))}

//             <Court scoreAnimation={scoreAnimation} />
//         </>
//     );
// }

// export default GameScene;

import { useRef } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useDetectGPU } from "@react-three/drei";
import Ball from "./Ball";
import ActiveBall from "./ActiveBall";
import Court from "./Court";
import { BALL_POOL_SIZE } from "../../constants/gameConstants";

function GameScene({
    throwData,
    onScore,
    onBallStopped,
    gameActive,
    showActiveBall,
    streak,
    scoreAnimation,
    enableEffects = true
}) {
    const GPUTier = useDetectGPU();
    const isLowEnd = GPUTier.tier < 2;
    const enableShadows = enableEffects && !isLowEnd;

    return (
        <>
            {/* ============ LIGHTING SETUP ============ */}

            {/* Ambient light for base illumination */}
            <ambientLight intensity={0.8} />

            {/* Main directional light (sun) - PRIMARY SHADOW CASTER */}
            <directionalLight
                position={[10, 20, 5]}
                intensity={1.5}
                castShadow={enableShadows}
                shadow-mapSize-width={enableShadows ? 2048 : 512}
                shadow-mapSize-height={enableShadows ? 2048 : 512}
                shadow-camera-far={50}
                shadow-camera-near={0.1}
                shadow-camera-left={-15}
                shadow-camera-right={15}
                shadow-camera-top={15}
                shadow-camera-bottom={-15}
                shadow-bias={-0.0005}  // Reduces shadow acne
                shadow-normalBias={0.02}
            />

            {/* Fill light - no shadows for performance */}
            <directionalLight
                position={[-8, 12, -5]}
                intensity={0.4}
            />

            {/* Back rim light for depth */}
            <pointLight
                position={[0, 10, -15]}
                intensity={0.6}
                color="#ffeedd"
            />

            {/* Hoop spotlight */}
            <spotLight
                position={[0, 15, 2]}
                angle={0.5}
                penumbra={0.5}
                intensity={1}
                color="#ffffff"
                castShadow={enableShadows}
                shadow-mapSize-width={512}
                shadow-mapSize-height={512}
                shadow-bias={-0.0005}
                target-position={[0, 3, -5]}
            />

            {/* Dynamic streak light */}
            {streak > 2 && (
                <pointLight
                    position={[0, 5, 0]}
                    intensity={Math.min(streak * 0.3, 2)}
                    color="#ff6600"
                    distance={20}
                />
            )}

            {/* ============ GAME OBJECTS ============ */}

            <ActiveBall
                isVisible={showActiveBall && gameActive}
                streak={streak}
                castShadow={enableShadows}
            />

            {Array.from({ length: BALL_POOL_SIZE }).map((_, index) => (
                <Ball
                    key={index}
                    id={index}
                    throwData={throwData}
                    onScore={onScore}
                    onBallStopped={onBallStopped}
                    gameActive={gameActive}
                    castShadow={enableShadows}
                    receiveShadow={enableShadows}
                />
            ))}

            <Court
                scoreAnimation={scoreAnimation}
                receiveShadow={enableShadows}
                castShadow={enableShadows}
                rightLogoPath="/Goat_GER_4C_Fin1.png"
                leftLogoPath="/Subway Hi-Res Logo.png.png"
            />

            {/* ============ POST-PROCESSING ============ */}

            {/* {enableEffects && !isLowEnd && (
                <EffectComposer>
                    <Bloom
                        intensity={0.9}
                        luminanceThreshold={0.4}
                        luminanceSmoothing={0.5}
                        mipmapBlur={true}
                        radius={0.9}
                    />
                </EffectComposer>
            )} */}
        </>
    );
}

export default GameScene;