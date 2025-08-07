import React, { useContext, useEffect } from 'react';
import * as THREE from 'three';
import { SceneContext } from './SceneProvider';

const SimpleTest: React.FC = () => {
    const { scene, isInitialized } = useContext(SceneContext);

    useEffect(() => {
        if (!scene || !isInitialized) return;

        console.log('SimpleTest: 添加测试球体');

        // 创建一个简单的红色球体
        const geometry = new THREE.SphereGeometry(1, 16, 16);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(0, 0, 10);
        sphere.name = 'test-sphere';

        scene.add(sphere);
        console.log('SimpleTest: 球体已添加到场景', sphere);

        return () => {
            console.log('SimpleTest: 清理球体');
            scene.remove(sphere);
            geometry.dispose();
            material.dispose();
        };
    }, [scene, isInitialized]);

    return null;
};

export default SimpleTest; 