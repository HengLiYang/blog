import React, { useContext, useEffect } from 'react';
import * as THREE from 'three';
import { SceneContext } from './SceneProvider';
import Earth from './Earth';
import Satellite from './Satellite';
import Stars from './Stars';

interface SatelliteData {
    id: string;
    name: string;
    model: string;
    position: [number, number, number];
    description: string;
    sensorType?: string;
}

interface SatelliteSceneProps {
    selectedSatellite: SatelliteData | null;
}

const SatelliteScene: React.FC<SatelliteSceneProps> = ({
    selectedSatellite,
}) => {
    const { camera, controls, isInitialized, isLoaded } = useContext(SceneContext);

    // 设置相机初始位置
    useEffect(() => {
        if (!camera || !controls) return;

        camera.position.set(0, 0, 5); // 调整相机位置，让地球在视野内
        camera.lookAt(0, 0, 0);
        controls.update();
        console.log('SatelliteScene: 相机位置设置完成', { position: camera.position });
    }, [camera, controls]);

    // 当选中卫星时，调整相机位置查看卫星
    useEffect(() => {
        if (!camera || !controls || !selectedSatellite) return;

        const [x, y, z] = selectedSatellite.position;

        // 计算相机位置：在卫星前方稍微偏移，让卫星在视野中心
        // 计算相机位置：在卫星前方稍微偏移，让卫星在视野中心
        const offset = 5; // 相机距离
        const cameraX = x + offset;
        const cameraY = y + 2; // 稍微向上
        const cameraZ = z + offset;
        // 平滑过渡到新位置
        const duration = 1.5;
        const startPosition = camera.position.clone();
        const endPosition = new THREE.Vector3(cameraX, cameraY, cameraZ);
        const startTime = Date.now();

        const animateCamera = () => {
            const elapsed = (Date.now() - startTime) / 1000;
            const progress = Math.min(elapsed / duration, 1);

            // 使用缓动函数使动画更自然
            const easeProgress = 1 - Math.pow(1 - progress, 3);

            camera.position.lerpVectors(startPosition, endPosition, easeProgress);
            camera.lookAt(x, y, z);
            controls.update();

            if (progress < 1) {
                requestAnimationFrame(animateCamera);
            }
        };

        animateCamera();
    }, [selectedSatellite, camera, controls]);

    if (!isInitialized) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p className="loading-text">正在初始化3D场景...</p>
            </div>
        );
    }

    return (
        <>
            {/* 星空背景 */}
            <Stars />

            {/* 始终渲染Earth组件 */}
            <Earth isRotating={true} selectedSatellite={selectedSatellite?.id} />

            {/* 显示loading状态 - 使用绝对定位挡住地球 */}
            {!isLoaded && (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p className="loading-text">正在加载地球模型...</p>
                </div>
            )}

            {/* 只在选中卫星时显示卫星模型 */}
            {selectedSatellite && (
                <Satellite
                    satellites={[selectedSatellite]}
                    onSatelliteClick={() => { }}
                />
            )}
        </>
    );
};

export default SatelliteScene; 