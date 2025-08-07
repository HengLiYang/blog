import React, { useContext, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { SceneContext } from './SceneProvider';

const Stars: React.FC = () => {
    const { scene, isInitialized } = useContext(SceneContext);
    const starsRef = useRef<{
        stars: THREE.Points | null;
        animationId: number | null;
    }>({
        stars: null,
        animationId: null,
    });

    useEffect(() => {
        if (!scene || !isInitialized) return;

        // 创建星空背景
        const createStars = () => {
            const starsGeometry = new THREE.BufferGeometry();
            const starsCount = 2000;
            const positions = new Float32Array(starsCount * 3);
            const colors = new Float32Array(starsCount * 3);
            const sizes = new Float32Array(starsCount);

            for (let i = 0; i < starsCount; i++) {
                const i3 = i * 3;

                // 随机位置（球形分布）
                const radius = 50 + Math.random() * 50;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(Math.random() * 2 - 1);

                positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
                positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
                positions[i3 + 2] = radius * Math.cos(phi);

                // 随机颜色（白色到蓝色）
                const color = new THREE.Color();
                color.setHSL(0.6 + Math.random() * 0.1, 0.8, 0.8 + Math.random() * 0.2);
                colors[i3] = color.r;
                colors[i3 + 1] = color.g;
                colors[i3 + 2] = color.b;

                // 随机大小
                sizes[i] = Math.random() * 2 + 0.5;
            }

            starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            starsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            starsGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

            const starsMaterial = new THREE.ShaderMaterial({
                vertexShader: `
                    attribute float size;
                    attribute vec3 color;
                    varying vec3 vColor;
                    void main() {
                        vColor = color;
                        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                        gl_PointSize = size * (300.0 / -mvPosition.z);
                        gl_Position = projectionMatrix * mvPosition;
                    }
                `,
                fragmentShader: `
                    varying vec3 vColor;
                    void main() {
                        float distance = length(gl_PointCoord - vec2(0.5));
                        if (distance > 0.5) discard;
                        gl_FragColor = vec4(vColor, 1.0 - distance * 2.0);
                    }
                `,
                transparent: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
            });

            const stars = new THREE.Points(starsGeometry, starsMaterial);
            scene.add(stars);
            starsRef.current.stars = stars;
        };

        // 动画函数
        const animate = () => {
            // 星星闪烁效果
            if (starsRef.current.stars) {
                const time = Date.now() * 0.001;
                const positions = starsRef.current.stars.geometry.attributes.position.array as Float32Array;

                for (let i = 0; i < positions.length; i += 3) {
                    // 轻微的闪烁效果
                    const flicker = Math.sin(time * 2 + i * 0.1) * 0.1 + 0.9;
                    positions[i + 1] += Math.sin(time + i) * 0.001 * flicker;
                }

                starsRef.current.stars.geometry.attributes.position.needsUpdate = true;
            }

            starsRef.current.animationId = requestAnimationFrame(animate);
        };

        createStars();
        animate();

        return () => {
            if (starsRef.current.animationId) {
                cancelAnimationFrame(starsRef.current.animationId);
            }

            if (starsRef.current.stars) {
                scene.remove(starsRef.current.stars);
                starsRef.current.stars.geometry.dispose();
                (starsRef.current.stars.material as THREE.ShaderMaterial).dispose();
            }
        };
    }, [scene, isInitialized]);

    return null;
};

export default Stars; 