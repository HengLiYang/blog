import React, { useContext, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { SceneContext } from './SceneProvider';

const PerformanceMonitor: React.FC = () => {
    const { renderer, controls } = useContext(SceneContext);
    const fpsRef = useRef<HTMLDivElement>(null);
    const memoryRef = useRef<HTMLDivElement>(null);
    const frameCountRef = useRef(0);
    const lastTimeRef = useRef(0);
    const [isZooming, setIsZooming] = useState(false);

    useEffect(() => {
        if (!renderer) return;

        const updateStats = () => {
            const time = performance.now();
            frameCountRef.current++;

            if (time - lastTimeRef.current >= 1000) {
                const fps = Math.round((frameCountRef.current * 1000) / (time - lastTimeRef.current));

                if (fpsRef.current) {
                    fpsRef.current.textContent = `FPS: ${fps}`;
                }

                if (memoryRef.current && renderer.info) {
                    const memory = renderer.info.memory;
                    memoryRef.current.textContent = `几何体: ${memory.geometries} | 纹理: ${memory.textures}`;
                }

                frameCountRef.current = 0;
                lastTimeRef.current = time;
            }

            requestAnimationFrame(updateStats);
        };

        updateStats();
    }, [renderer]);

    return (
        <div className="monitor-container monitor-container-top">
            <div ref={fpsRef}>FPS: --</div>
            <div ref={memoryRef}>几何体: -- | 材质: -- | 纹理: --</div>
        </div>
    );
};

export default PerformanceMonitor; 