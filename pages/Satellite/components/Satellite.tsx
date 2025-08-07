import React, { useContext, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { SceneContext } from './SceneProvider';

interface SatelliteData {
    id: string;
    name: string;
    model: string;
    position: [number, number, number];
    description: string;
    sensorType?: string;
}

interface SatelliteProps {
    satellites: SatelliteData[];
    onSatelliteClick?: (satelliteId: string) => void;
}

const Satellite: React.FC<SatelliteProps> = ({
    satellites,
    onSatelliteClick,
}) => {
    const { scene, resourceManager, isInitialized } = useContext(SceneContext);
    const satellitesRef = useRef<{
        meshes: THREE.Object3D[];
        satelliteIds: string[];
        selectedIndex: number | null;
        highlightMeshes: Map<number, THREE.Mesh>;
    }>({
        meshes: [],
        satelliteIds: [],
        selectedIndex: null,
        highlightMeshes: new Map(),
    });

    useEffect(() => {
        if (!scene || !resourceManager || !isInitialized || satellites.length === 0) {
            console.log('Satellite: 条件不满足，跳过加载', {
                scene: !!scene,
                resourceManager: !!resourceManager,
                isInitialized,
                satellitesLength: satellites.length
            });
            return;
        }

        console.log('Satellite: 开始加载卫星模型', {
            satellitesCount: satellites.length,
            satellites: satellites.map(s => ({ id: s.id, name: s.name, position: s.position, model: s.model }))
        });

        // 清理旧的实例
        if (satellitesRef.current.meshes.length > 0) {
            satellitesRef.current.meshes.forEach(mesh => {
                scene.remove(mesh);
                mesh.traverse((child) => {
                    if (child instanceof THREE.Mesh) {
                        if (child.geometry) child.geometry.dispose();
                        if (child.material) {
                            if (Array.isArray(child.material)) {
                                child.material.forEach(m => m.dispose());
                            } else {
                                child.material.dispose();
                            }
                        }
                    }
                });
            });
            satellitesRef.current.highlightMeshes.forEach(mesh => {
                scene.remove(mesh);
                if (mesh.geometry) mesh.geometry.dispose();
                if (mesh.material) {
                    if (Array.isArray(mesh.material)) {
                        mesh.material.forEach(m => m.dispose());
                    } else {
                        mesh.material.dispose();
                    }
                }
            });
        }

        const meshes: THREE.Object3D[] = [];
        const satelliteIds: string[] = satellites.map(sat => sat.id);

        // 为每个卫星加载GLB模型
        satellites.forEach((satellite) => {
            const [x, y, z] = satellite.position;

            try {
                console.log('Satellite: 开始加载模型', satellite.model);
                const loader = new GLTFLoader();

                loader.load(
                    satellite.model,
                    (gltf) => {
                        console.log('卫星加载成功:', satellite.id, satellite.model, {
                            scene: gltf.scene,
                            animations: gltf.animations,
                            asset: gltf.asset,
                            sceneChildren: gltf.scene.children.length
                        });
                        const model = gltf.scene;
                        model.position.set(x, y, z);

                        // 根据卫星ID调整不同的缩放比例
                        let scale = 1.0;
                        switch (satellite.id) {
                            case 'satellite-1': // 高分一号
                                scale = 3; // 增大
                                break;
                            case 'satellite-2': // 高分二号
                                scale = 1; // 保持不变
                                break;
                            case 'satellite-3': // 高分三号
                                scale = 3; // 增大
                                break;
                            case 'satellite-4': // 北斗导航卫星
                                scale = 2.5; // 增大
                                break;
                            case 'satellite-5': // 气象卫星
                                scale = 3.5; // 增大
                                break;
                            default:
                                scale = 2.0;
                        }

                        model.scale.set(scale, scale, scale);
                        model.name = `satellite-${satellite.id}`;

                        // 检查模型的包围盒
                        const box = new THREE.Box3().setFromObject(model);
                        console.log('Satellite: 模型包围盒信息', JSON.stringify({
                            satelliteId: satellite.id,
                            scale: scale,
                            min: box.min,
                            max: box.max,
                            size: box.getSize(new THREE.Vector3()),
                            center: box.getCenter(new THREE.Vector3())
                        }));

                        // 设置用户数据用于交互
                        model.userData = {
                            isClickable: true,
                            satelliteId: satellite.id,
                            onSatelliteClick: onSatelliteClick
                        };

                        // 遍历模型中的所有网格，设置交互数据
                        model.traverse((child) => {
                            if (child instanceof THREE.Mesh) {
                                child.userData = {
                                    isClickable: true,
                                    satelliteId: satellite.id,
                                    onSatelliteClick: onSatelliteClick
                                };
                            }
                        });

                        // 为卫星添加光照
                        const satelliteLight = new THREE.DirectionalLight(0xffffff, 1.0);
                        satelliteLight.position.set(5, 5, 5);
                        satelliteLight.target = model;
                        scene.add(satelliteLight);

                        // 添加环境光
                        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
                        scene.add(ambientLight);

                        scene.add(model);
                        meshes.push(model);
                        console.log('Satellite: 卫星已添加到场景', JSON.stringify({
                            satelliteId: satellite.id,
                            modelName: model.name,
                            position: model.position,
                            visible: model.visible,
                            sceneChildren: scene.children.length,
                            lightsAdded: true
                        }));
                    },
                    (progress) => {
                        // 静默处理进度
                    },
                    (error: any) => {
                        console.error('卫星加载失败，使用备用几何体:', satellite.id, satellite.model, error);
                        console.error('错误详情:', {
                            message: error?.message || '未知错误',
                            type: error?.type || '未知类型',
                            url: satellite.model
                        });
                        // 如果GLB加载失败，创建备用几何体
                        const fallbackGeometry = new THREE.BoxGeometry(1.5, 0.8, 3.0); // 调整备用几何体大小
                        const fallbackMaterial = new THREE.MeshPhongMaterial({
                            color: 0x444444,
                            shininess: 100
                        });
                        const fallbackMesh = new THREE.Mesh(fallbackGeometry, fallbackMaterial);
                        fallbackMesh.position.set(x, y, z);
                        fallbackMesh.name = `satellite-${satellite.id}-fallback`;
                        fallbackMesh.userData = {
                            isClickable: true,
                            satelliteId: satellite.id,
                            onSatelliteClick: onSatelliteClick
                        };

                        scene.add(fallbackMesh);
                        meshes.push(fallbackMesh);
                        console.log('Satellite: 备用几何体已添加到场景', {
                            satelliteId: satellite.id,
                            meshName: fallbackMesh.name,
                            position: fallbackMesh.position,
                            visible: fallbackMesh.visible,
                            sceneChildren: scene.children.length
                        });
                    }
                );
            } catch (error) {
                console.error('Satellite: GLTFLoader 创建失败', error);
                // 如果无法创建GLTFLoader，使用备用几何体
                const fallbackGeometry = new THREE.BoxGeometry(1.0, 0.5, 2.0);
                const fallbackMaterial = new THREE.MeshPhongMaterial({
                    color: 0x444444,
                    shininess: 100
                });
                const fallbackMesh = new THREE.Mesh(fallbackGeometry, fallbackMaterial);
                fallbackMesh.position.set(x, y, z);
                fallbackMesh.name = `satellite-${satellite.id}-fallback`;
                fallbackMesh.userData = {
                    isClickable: true,
                    satelliteId: satellite.id,
                    onSatelliteClick: onSatelliteClick
                };

                scene.add(fallbackMesh);
                meshes.push(fallbackMesh);
            }
        });

        satellitesRef.current.meshes = meshes;
        satellitesRef.current.satelliteIds = satelliteIds;

        return () => {
            satellitesRef.current.meshes.forEach(mesh => {
                scene.remove(mesh);
                mesh.traverse((child) => {
                    if (child instanceof THREE.Mesh) {
                        if (child.geometry) child.geometry.dispose();
                        if (child.material) {
                            if (Array.isArray(child.material)) {
                                child.material.forEach(m => m.dispose());
                            } else {
                                child.material.dispose();
                            }
                        }
                    }
                });
            });

            satellitesRef.current.highlightMeshes.forEach(mesh => {
                scene.remove(mesh);
                if (mesh.geometry) mesh.geometry.dispose();
                if (mesh.material) {
                    if (Array.isArray(mesh.material)) {
                        mesh.material.forEach(m => m.dispose());
                    } else {
                        mesh.material.dispose();
                    }
                }
            });

            satellitesRef.current = {
                meshes: [],
                satelliteIds: [],
                selectedIndex: null,
                highlightMeshes: new Map(),
            };
        };
    }, [scene, resourceManager, isInitialized, satellites, onSatelliteClick]);

    return null; // 这个组件不渲染任何UI，只管理3D对象
};

export default Satellite; 