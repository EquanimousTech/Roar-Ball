import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { HOOP_POS, HOOP_RADIUS, BACK_WALL_Z, SIDE_WALL_X } from "../../constants/gameConstants";

// Logo component for reusability
function Logo({ position, texturePath, size = [0.8, 0.8] }) {
    const texture = useTexture(texturePath);

    return (
        <mesh position={position}>
            <planeGeometry args={size} />
            <meshBasicMaterial
                map={texture}
                transparent
                side={THREE.DoubleSide}
            />
        </mesh>
    );
}

// Alternative: Placeholder logo without texture
function PlaceholderLogo({ position, color = "#ffffff", size = [0.8, 0.8] }) {
    return (
        <mesh position={position}>
            <planeGeometry args={size} />
            <meshBasicMaterial
                color={color}
                transparent
                opacity={0.8}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
}

function Court({ scoreAnimation = 0, leftLogoPath, rightLogoPath }) {
    const netRef = useRef();
    const animationRef = useRef({ active: false, time: 0 });

    // Trigger animation when scoreAnimation changes (increments on each score)
    useEffect(() => {
        if (scoreAnimation > 0) {
            animationRef.current = { active: true, time: 0 };
        }
    }, [scoreAnimation]);

    useFrame((state, delta) => {
        if (animationRef.current.active && netRef.current) {
            animationRef.current.time += delta;
            const t = animationRef.current.time;

            // Damped oscillation for natural net movement
            const damping = Math.exp(-t * 3);

            // Wave effect - squeeze and stretch
            const scaleXZ = 1 + Math.sin(t * 18) * 0.2 * damping;
            const scaleY = 1 + Math.sin(t * 12 + Math.PI / 2) * 0.15 * damping;

            // Slight downward movement to simulate ball pushing through
            const offsetY = Math.sin(t * 10) * 0.05 * damping;

            netRef.current.scale.set(scaleXZ, scaleY, scaleXZ);
            netRef.current.position.y = -0.35 + offsetY;

            // End animation after ~1.2 seconds
            if (t > 1.2) {
                animationRef.current.active = false;
                netRef.current.scale.set(1, 1, 1);
                netRef.current.position.y = -0.35;
            }
        }
    });

    // Logo positions - adjust these values as needed
    const logoOffsetX = 1.2; // Distance from center (hoop)
    const logoY = HOOP_POS.y + 0.4; // Same height as backboard
    const logoZ = HOOP_POS.z - HOOP_RADIUS - 0.1; // Slightly in front of backboard

    return (
        <>
            {/* Hoop */}
            <group position={[HOOP_POS.x, HOOP_POS.y, HOOP_POS.z]}>
                {/* Hoop Ring */}
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[HOOP_RADIUS, 0.03, 16, 32]} />
                    <meshStandardMaterial color="#a270ff" metalness={0.8} roughness={0.3} />
                </mesh>

                {/* Net (wireframe) - with ref for animation */}
                <mesh ref={netRef} position={[0, -0.35, 0]}>
                    <cylinderGeometry args={[HOOP_RADIUS - 0.05, 0.12, 0.55, 12, 6, true]} />
                    <meshBasicMaterial color="white" wireframe transparent opacity={0.7} />
                </mesh>

                {/* Hoop connector */}
                <mesh position={[0, 0, -HOOP_RADIUS - 0.1]}>
                    <boxGeometry args={[0.06, 0.06, 0.25]} />
                    <meshStandardMaterial color="#221666" metalness={0.7} />
                </mesh>
            </group>

            {/* Backboard */}
            <mesh position={[HOOP_POS.x, HOOP_POS.y + 0.4, HOOP_POS.z - HOOP_RADIUS - 0.2]}>
                <boxGeometry args={[1.4, 1, 0.08]} />
                <meshStandardMaterial color="black" transparent opacity={0.4} />
            </mesh>
            <lineSegments position={[HOOP_POS.x, HOOP_POS.y + 0.4, HOOP_POS.z - HOOP_RADIUS - 0.15]}>
                <edgesGeometry args={[new THREE.BoxGeometry(1.4, 1, 0.08)]} />
                <lineBasicMaterial color="white" />
            </lineSegments>
            <mesh position={[HOOP_POS.x, HOOP_POS.y + 0.25, HOOP_POS.z - HOOP_RADIUS - 0.15]}>
                <planeGeometry args={[0.5, 0.4]} />
                <meshBasicMaterial color="white" transparent opacity={0} side={THREE.DoubleSide} />
            </mesh>

            {/* Left Logo */}
            {leftLogoPath ? (
                <Logo
                    position={[HOOP_POS.x - logoOffsetX, logoY, logoZ]}
                    texturePath={leftLogoPath}
                    size={[2.2, 0.5]}
                />
            ) : (
                <PlaceholderLogo
                    position={[HOOP_POS.x - logoOffsetX, logoY, logoZ]}
                    color="#ff6b6b"
                    size={[0.8, 0.8]}
                />
            )}

            {/* Right Logo */}
            {rightLogoPath ? (
                <Logo
                    position={[HOOP_POS.x + logoOffsetX, logoY, logoZ]}
                    texturePath={rightLogoPath}
                    size={[2, 1]}
                />
            ) : (
                <PlaceholderLogo
                    position={[HOOP_POS.x + logoOffsetX, logoY, logoZ]}
                    color="#4ecdc4"
                    size={[0.8, 0.8]}
                />
            )}

            {/* Back wall (invisible) */}
            <mesh position={[0, 1, BACK_WALL_Z]} visible={false}>
                <boxGeometry args={[10, 8, 0.2]} />
                <meshBasicMaterial color="blue" transparent opacity={0} />
            </mesh>

            {/* Side walls (invisible) */}
            <mesh position={[SIDE_WALL_X, 1, -2]} visible={false}>
                <boxGeometry args={[0.2, 8, 10]} />
                <meshBasicMaterial color="red" transparent opacity={0.1} />
            </mesh>
            <mesh position={[-SIDE_WALL_X, 1, -2]} visible={false}>
                <boxGeometry args={[0.2, 8, 10]} />
                <meshBasicMaterial color="red" transparent opacity={0.1} />
            </mesh>
        </>
    );
}

export default Court;