import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { BALL_START, BALL_RADIUS } from "../../constants/gameConstants";

// Preload the model
useGLTF.preload("/models/ballNewOptimized.glb");

function ActiveBall({ isVisible, streak }) {
    const groupRef = useRef();

    // Load the GLB model
    const { scene } = useGLTF("/models/ballNewOptimized.glb");

    // Clone the scene for this instance
    const clonedScene = useMemo(() => {
        const clone = scene.clone();
        clone.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        return clone;
    }, [scene]);

    useFrame((state, delta) => {
        if (!groupRef.current || !isVisible) return;

        const ball = groupRef.current;
        ball.position.x = BALL_START.x;
        ball.position.y = BALL_START.y + Math.sin(state.clock.elapsedTime * 3) * 0.05;
        ball.position.z = BALL_START.z;
        ball.rotation.y += delta * (0.5 + streak * 0.1);
    });

    // Adjust scale based on your model's original size
    const modelScale = BALL_RADIUS * 1.1; // Tweak this value as needed

    return (
        <group
            ref={groupRef}
            position={[BALL_START.x, BALL_START.y, BALL_START.z]}
            visible={isVisible}
        >
            <primitive
                object={clonedScene}
                scale={[modelScale, modelScale, modelScale]}
            />
        </group>
    );
}

export default ActiveBall;