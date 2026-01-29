import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

import {
    GRAVITY,
    HOOP_POS,
    BALL_START,
    BALL_RADIUS,
    HOOP_RADIUS,
    BACK_WALL_Z,
    SIDE_WALL_X,
} from "../../constants/gameConstants";

// Preload the model for better performance
useGLTF.preload("/models/ballNewOptimized.glb");

function Ball({ id, throwData, onScore, onBallStopped, gameActive }) {
    const groupRef = useRef();
    const velocity = useRef(new THREE.Vector3(0, 0, 0));
    const ballState = useRef("idle");
    const hasScored = useRef(false);

    // Load the GLB model
    const { scene } = useGLTF("/models/ballNewOptimized.glb");

    // Clone the scene so each ball instance has its own copy
    const clonedScene = useMemo(() => {
        const clone = scene.clone();
        // Enable shadows for all meshes in the model
        clone.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        return clone;
    }, [scene]);

    const resetBall = () => {
        if (!groupRef.current) return;
        groupRef.current.position.set(BALL_START.x, BALL_START.y, BALL_START.z);
        groupRef.current.visible = false;
        velocity.current.set(0, 0, 0);
        ballState.current = "idle";
        hasScored.current = false;
    };

    useEffect(() => {
        if (!throwData || !groupRef.current || !gameActive) return;
        if (throwData.ballId !== id) return;

        groupRef.current.position.set(BALL_START.x, BALL_START.y, BALL_START.z);
        groupRef.current.visible = true;
        velocity.current.set(throwData.x, throwData.y, throwData.z);
        ballState.current = "flying";
        hasScored.current = false;
    }, [throwData, id, gameActive]);

    useFrame((state, delta) => {
        if (!groupRef.current) return;

        const ball = groupRef.current;
        const pos = ball.position;
        const vel = velocity.current;

        if (ballState.current === "idle" || ballState.current === "stopped") {
            ball.visible = false;
            return;
        }

        if (ballState.current === "ready") {
            pos.x = BALL_START.x;
            pos.y = BALL_START.y + Math.sin(state.clock.elapsedTime * 3 + id) * 0.05;
            pos.z = BALL_START.z;
            ball.rotation.y += delta * 0.5;
            ball.visible = true;
            return;
        }

        if (ballState.current === "passing") {
            const dt = Math.min(delta, 0.05);
            vel.y += GRAVITY * dt;
            pos.y += vel.y * dt;
            pos.x += vel.x * dt * 0.3;
            pos.z += vel.z * dt * 0.3;

            if (pos.y < HOOP_POS.y - 1.0) {
                ballState.current = "stopped";
                ball.visible = false;
                onBallStopped?.(id, "scored");
            }
            return;
        }

        if (ballState.current !== "flying") return;

        const dt = Math.min(delta, 0.05);
        const prevY = pos.y;

        vel.y += GRAVITY * dt;

        pos.x += vel.x * dt;
        pos.y += vel.y * dt;
        pos.z += vel.z * dt;

        ball.rotation.x += vel.z * dt * 2;
        ball.rotation.z -= vel.x * dt * 2;

        // Back wall collision
        if (pos.z < BACK_WALL_Z + BALL_RADIUS) {
            pos.z = BACK_WALL_Z + BALL_RADIUS;
            vel.z *= -0.6;
            vel.x *= 0.8;
            vel.y *= 0.9;
        }

        // Side wall collisions
        if (pos.x > SIDE_WALL_X - BALL_RADIUS) {
            pos.x = SIDE_WALL_X - BALL_RADIUS;
            vel.x *= -0.6;
        }
        if (pos.x < -SIDE_WALL_X + BALL_RADIUS) {
            pos.x = -SIDE_WALL_X + BALL_RADIUS;
            vel.x *= -0.6;
        }

        // Scoring detection
        if (!hasScored.current && vel.y < 0) {
            const distToHoopCenter = Math.sqrt(
                (pos.x - HOOP_POS.x) ** 2 + (pos.z - HOOP_POS.z) ** 2
            );

            const isInsideRim = distToHoopCenter < HOOP_RADIUS - BALL_RADIUS * 0.5;
            const crossedHoopPlane = prevY >= HOOP_POS.y && pos.y < HOOP_POS.y;

            if (isInsideRim && crossedHoopPlane) {
                hasScored.current = true;
                ballState.current = "passing";
                onScore?.(id);
                return;
            }
        }

        // Rim collision
        const toHoopX = pos.x - HOOP_POS.x;
        const toHoopZ = pos.z - HOOP_POS.z;
        const distFromCenter = Math.sqrt(toHoopX * toHoopX + toHoopZ * toHoopZ);

        if (Math.abs(pos.y - HOOP_POS.y) < BALL_RADIUS + 0.05) {
            const rimInnerEdge = HOOP_RADIUS - 0.03;
            const rimOuterEdge = HOOP_RADIUS + 0.03;

            if (
                distFromCenter > rimInnerEdge - BALL_RADIUS &&
                distFromCenter < rimOuterEdge + BALL_RADIUS
            ) {
                const nx = toHoopX / (distFromCenter || 1);
                const nz = toHoopZ / (distFromCenter || 1);

                if (distFromCenter > HOOP_RADIUS) {
                    vel.x += nx * 3;
                    vel.z += nz * 3;
                } else {
                    vel.x -= nx * 2;
                    vel.z -= nz * 2;
                }

                vel.y *= -0.4;
                vel.x *= 0.6;
                vel.z *= 0.6;
            }
        }

        // Backboard collision
        const backboardZ = HOOP_POS.z - HOOP_RADIUS - 0.2;
        if (
            pos.z < backboardZ + BALL_RADIUS &&
            pos.z > backboardZ - 0.1 &&
            Math.abs(pos.x - HOOP_POS.x) < 0.7 &&
            pos.y > HOOP_POS.y - 0.3 &&
            pos.y < HOOP_POS.y + 0.9
        ) {
            vel.z *= -0.5;
            pos.z = backboardZ + BALL_RADIUS + 0.01;
        }

        // Floor collision
        const floorY = -1.5 + BALL_RADIUS;
        if (pos.y < floorY) {
            pos.y = floorY;
            vel.y *= -0.5;
            vel.x *= 0.7;
            vel.z *= 0.7;

            const speed = Math.sqrt(vel.x ** 2 + vel.y ** 2 + vel.z ** 2);
            if (speed < 0.5) {
                vel.set(0, 0, 0);
                ballState.current = "stopped";
                ball.visible = false;
                onBallStopped?.(id, "missed");
                return;
            }
        }

        // Out of bounds
        if (pos.y < -5 || pos.z > 15 || Math.abs(pos.x) > 15) {
            ballState.current = "stopped";
            ball.visible = false;
            onBallStopped?.(id, "missed");
            return;
        }
    });

    // Adjust scale based on your model's original size
    // You may need to tweak this value
    const modelScale = BALL_RADIUS * 1.4; // Adjust multiplier as needed

    return (
        <group
            ref={groupRef}
            position={[BALL_START.x, BALL_START.y, BALL_START.z]}
            visible={false}
        >
            <primitive
                object={clonedScene}
                scale={[modelScale, modelScale, modelScale]}
            />
        </group>
    );
}

export default Ball;