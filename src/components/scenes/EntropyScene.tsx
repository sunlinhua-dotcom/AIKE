'use client';

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '@/store/gameStore';

function HumanParticles() {
    const ref = useRef<THREE.Points>(null);
    const { entropy } = useGameStore();

    // Generate particles in human shape
    const [positions, originalPositions] = useMemo(() => {
        const count = 2000;
        const pos = new Float32Array(count * 3);
        const orig = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            let x = 0, y = 0, z = 0;

            // Simplified human body shape
            const section = Math.random();
            if (section < 0.2) {
                // Head
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.random() * Math.PI;
                const r = 0.3 + Math.random() * 0.1;
                x = r * Math.sin(phi) * Math.cos(theta);
                y = 2.2 + r * Math.cos(phi);
                z = r * Math.sin(phi) * Math.sin(theta);
            } else if (section < 0.6) {
                // Torso
                x = (Math.random() - 0.5) * 0.8;
                y = 0.5 + Math.random() * 1.5;
                z = (Math.random() - 0.5) * 0.4;
            } else if (section < 0.8) {
                // Arms
                const side = Math.random() > 0.5 ? 1 : -1;
                x = side * (0.4 + Math.random() * 0.6);
                y = 1.0 + Math.random() * 0.8;
                z = (Math.random() - 0.5) * 0.2;
            } else {
                // Legs
                const side = Math.random() > 0.5 ? 0.15 : -0.15;
                x = side + (Math.random() - 0.5) * 0.2;
                y = Math.random() * 0.5;
                z = (Math.random() - 0.5) * 0.2;
            }

            pos[i3] = x;
            pos[i3 + 1] = y;
            pos[i3 + 2] = z;
            orig[i3] = x;
            orig[i3 + 1] = y;
            orig[i3 + 2] = z;
        }
        return [pos, orig];
    }, []);

    useFrame((state) => {
        if (!ref.current) return;
        const positions = ref.current.geometry.attributes.position.array as Float32Array;
        const t = state.clock.elapsedTime;
        const entropyFactor = entropy / 100;

        for (let i = 0; i < positions.length / 3; i++) {
            const i3 = i * 3;
            const ox = originalPositions[i3];
            const oy = originalPositions[i3 + 1];
            const oz = originalPositions[i3 + 2];

            // Drift away based on entropy
            const noise = Math.sin(t * 0.5 + i * 0.1) * entropyFactor;
            const drift = entropyFactor * 3;

            positions[i3] = ox + (Math.sin(i * 17.3 + t * 0.3) * drift) + noise * 0.5;
            positions[i3 + 1] = oy + (Math.cos(i * 23.7 + t * 0.2) * drift) + noise * 0.3;
            positions[i3 + 2] = oz + (Math.sin(i * 31.1 + t * 0.4) * drift) + noise * 0.5;
        }

        ref.current.geometry.attributes.position.needsUpdate = true;
        ref.current.rotation.y = Math.sin(t * 0.1) * 0.1;
    });

    return (
        <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color="#00ccff"
                size={0.03}
                sizeAttenuation
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </Points>
    );
}

export default function EntropyScene() {
    const { entropy, setEntropy } = useGameStore();

    // Auto decay
    useEffect(() => {
        const interval = setInterval(() => {
            setEntropy(entropy + 0.2);
        }, 100);
        return () => clearInterval(interval);
    }, [entropy, setEntropy]);

    return (
        <div className="absolute inset-0">
            <Canvas camera={{ position: [0, 1.2, 4], fov: 60 }}>
                <ambientLight intensity={0.1} />
                <pointLight position={[5, 5, 5]} intensity={0.5} color="#00ccff" />
                <pointLight position={[-5, 3, -5]} intensity={0.5} color="#ff3366" />
                <HumanParticles />
            </Canvas>

            {/* Controls Overlay */}
            <div className="absolute bottom-[200px] left-1/2 -translate-x-1/2 flex gap-4 z-10">
                <button
                    onClick={() => setEntropy(Math.min(100, entropy + 25))}
                    className="px-6 py-3 bg-red-500/80 hover:bg-red-500 text-white rounded-lg font-bold transition-all hover:scale-105 backdrop-blur-sm border border-red-400/30"
                >
                    🎮 刷短视频 (熵增)
                </button>
                <button
                    onClick={() => setEntropy(0)}
                    className="px-6 py-3 bg-cyan-500/80 hover:bg-cyan-500 text-white rounded-lg font-bold transition-all hover:scale-105 backdrop-blur-sm border border-cyan-400/30"
                >
                    📚 深度思考 (做功)
                </button>
            </div>

            {/* Entropy Meter */}
            <div className="absolute top-6 right-6 z-10 bg-black/50 backdrop-blur-md rounded-xl p-4 border border-white/10 min-w-[150px]">
                <div className="text-xs uppercase tracking-widest text-pink-400 mb-1">Entropy Level</div>
                <div className="text-3xl font-extrabold text-white">{Math.round(entropy)}%</div>
                <div className="mt-2 h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                            width: `${entropy}%`,
                            background: `linear-gradient(to right, #00ccff, ${entropy > 60 ? '#ff3366' : '#00ccff'})`,
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
