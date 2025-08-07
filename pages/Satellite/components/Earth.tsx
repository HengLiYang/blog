import type React from 'react';
import { useContext, useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { SceneContext } from './SceneProvider';
import {
    EARTH_CONSTANTS,
    ATMOSPHERE_PARAMS,
    MATERIAL_PARAMS,
    LIGHT_PARAMS,
    POSITION_PARAMS,
    SHADOW_PARAMS,
    INITIAL_ROTATION,
    SHADERS,
    TEXTURE_PATHS,
} from './constants';

interface EarthProps {
    worldRadius?: number;
    isRotating?: boolean;
    rotationAxis?: THREE.Vector3;
    selectedSatellite?: string | null;
}

const Earth: React.FC<EarthProps> = ({
    worldRadius = EARTH_CONSTANTS.DEFAULT_RADIUS,
    isRotating = true,
    rotationAxis = new THREE.Vector3(0, 1, 0),
    selectedSatellite = null
}) => {
    const { scene, camera, renderer, resourceManager, isLoaded, setIsLoaded } = useContext(SceneContext);
    const earthRef = useRef<{
        group: THREE.Group | null;
        earth: THREE.Mesh | null;
        clouds: THREE.Mesh | null;
        atmosphere: THREE.Mesh | null;
        lights: {
            ambient: THREE.AmbientLight | null;
            directional: THREE.DirectionalLight | null;
            additionalLights: (THREE.DirectionalLight | THREE.PointLight | THREE.AmbientLight)[];
        };
        geometry: THREE.SphereGeometry | null;
        materials: {
            earth: THREE.MeshPhongMaterial | null;
            clouds: THREE.MeshPhongMaterial | null;
            atmosphere: THREE.ShaderMaterial | null;
        };
        textures: {
            dayMap: THREE.Texture | null;
            nightMap: THREE.Texture | null;
            bumpMap: THREE.Texture | null;
            specularMap: THREE.Texture | null;
            cloudsMap: THREE.Texture | null;
        };
        worldRadius: number;
        updateFunctionId: number | null;
    }>({
        group: null,
        earth: null,
        clouds: null,
        atmosphere: null,
        lights: {
            ambient: null,
            directional: null,
            additionalLights: [],
        },
        geometry: null,
        materials: {
            earth: null,
            clouds: null,
            atmosphere: null,
        },
        textures: {
            dayMap: null,
            nightMap: null,
            bumpMap: null,
            specularMap: null,
            cloudsMap: null,
        },
        worldRadius,
        updateFunctionId: null,
    });

    // 使用useMemo稳定atmosphereParams对象，避免重复创建
    const atmosphereParams = useMemo(() => ({
        atmOpacity: ATMOSPHERE_PARAMS.ATM_OPACITY,
        atmPowFactor: ATMOSPHERE_PARAMS.ATM_POW_FACTOR,
        atmMultiplier: ATMOSPHERE_PARAMS.ATM_MULTIPLIER,
    }), []);

    // 使用useMemo稳定rotationAxis对象
    const stableRotationAxis = useMemo(() => rotationAxis, [rotationAxis.x, rotationAxis.y, rotationAxis.z]);


    useEffect(() => {
        // 如果地球模型已存在，只控制显示/隐藏
        if (earthRef.current.group) {
            if (selectedSatellite) {
                // 隐藏地球
                earthRef.current.group.visible = false;
                console.log('Earth: 隐藏地球模型');
            } else {
                // 显示地球
                earthRef.current.group.visible = true;
                console.log('Earth: 显示地球模型');
            }
        }
    }, [selectedSatellite])

    useEffect(() => {

        if (!scene || !camera || !renderer || !resourceManager) {
            console.log('Earth: 场景、相机、渲染器或资源管理器不可用');
            return;
        }
        // 设置加载状态为false，开始加载
        setIsLoaded(false);
        console.log('Earth: 开始加载地球模型');

        const group = new THREE.Group();
        group.name = 'earth-group';

        // 设置初始旋转 - 中国和太平洋区域朝向摄像机
        group.rotation.set(
            INITIAL_ROTATION.X,
            INITIAL_ROTATION.Y,
            INITIAL_ROTATION.Z
        );
        scene.add(group);
        earthRef.current.group = group;
        group.position.set(0, 0, 0);

        const geometry = new THREE.SphereGeometry(worldRadius, EARTH_CONSTANTS.GEOMETRY_SEGMENTS, EARTH_CONSTANTS.GEOMETRY_SEGMENTS);
        earthRef.current.geometry = geometry;

        const loadTextures = async () => {
            try {
                console.log('Earth: 开始加载纹理文件');

                console.log('Earth: 开始加载纹理文件，路径:', {
                    ALBEDO: TEXTURE_PATHS.ALBEDO,
                    NIGHT_LIGHTS: TEXTURE_PATHS.NIGHT_LIGHTS,
                    BUMP: TEXTURE_PATHS.BUMP,
                    CLOUDS: TEXTURE_PATHS.CLOUDS
                });

                const [dayMap, nightMap, bumpMap, specularMap, cloudsMap] = await Promise.all([
                    resourceManager.loadTexture(TEXTURE_PATHS.ALBEDO),
                    resourceManager.loadTexture(TEXTURE_PATHS.NIGHT_LIGHTS),
                    resourceManager.loadTexture(TEXTURE_PATHS.BUMP),
                    resourceManager.loadTexture('/textures/Ocean.png'), // 使用 Ocean.png 作为 specularMap
                    resourceManager.loadTexture(TEXTURE_PATHS.CLOUDS),
                ]);

                console.log('Earth: 纹理加载完成');

                // 设置纹理属性
                dayMap.wrapS = THREE.ClampToEdgeWrapping;
                dayMap.wrapT = THREE.ClampToEdgeWrapping;
                dayMap.colorSpace = THREE.SRGBColorSpace;

                bumpMap.wrapS = THREE.ClampToEdgeWrapping;
                bumpMap.wrapT = THREE.ClampToEdgeWrapping;
                bumpMap.colorSpace = THREE.NoColorSpace;

                specularMap.wrapS = THREE.ClampToEdgeWrapping;
                specularMap.wrapT = THREE.ClampToEdgeWrapping;
                specularMap.colorSpace = THREE.NoColorSpace;


                // 创建地球材质 - 使用 MeshPhongMaterial 支持 emissive 效果
                const earthMaterial = new THREE.MeshPhongMaterial({
                    map: dayMap,
                    bumpMap: bumpMap,
                    bumpScale: MATERIAL_PARAMS.BUMP_SCALE,
                    specularMap: specularMap,
                    specular: new THREE.Color(0x2266aa),  // 蓝色镜面反射
                    shininess: 25,
                    emissive: new THREE.Color(0xFFAC00),  // 发光颜色
                    emissiveMap: nightMap,  // 夜晚灯光纹理
                    emissiveIntensity: 3.5,  // 发光强度
                    color: new THREE.Color(0xf0f8ff),  // 淡蓝色基础色
                });

                // 创建云层材质
                const cloudsMaterial = new THREE.MeshPhongMaterial({
                    map: cloudsMap,
                    transparent: true,
                    opacity: MATERIAL_PARAMS.CLOUDS_OPACITY,
                });

                // 创建大气层材质
                const atmosphereMaterial = new THREE.ShaderMaterial({
                    vertexShader: SHADERS.ATMOSPHERE_VERTEX,
                    fragmentShader: SHADERS.ATMOSPHERE_FRAGMENT,
                    uniforms: {
                        atmOpacity: { value: atmosphereParams.atmOpacity },
                        atmPowFactor: { value: atmosphereParams.atmPowFactor },
                        atmMultiplier: { value: atmosphereParams.atmMultiplier },
                    },
                    transparent: true,
                    side: THREE.BackSide,
                });

                // 创建地球网格
                const earth = new THREE.Mesh(geometry, earthMaterial);
                earth.name = 'earth-mesh';
                earth.renderOrder = 1; // 设置渲染顺序
                group.add(earth);
                earthRef.current.earth = earth;
                // 创建云层网格
                const cloudsGeometry = new THREE.SphereGeometry(worldRadius + EARTH_CONSTANTS.CLOUDS_OFFSET, EARTH_CONSTANTS.GEOMETRY_SEGMENTS, EARTH_CONSTANTS.GEOMETRY_SEGMENTS);
                const clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
                clouds.name = 'clouds-mesh';
                group.add(clouds);
                earthRef.current.clouds = clouds;

                // 创建大气层网格
                const atmosphereGeometry = new THREE.SphereGeometry(worldRadius + EARTH_CONSTANTS.ATMOSPHERE_OFFSET, EARTH_CONSTANTS.GEOMETRY_SEGMENTS, EARTH_CONSTANTS.GEOMETRY_SEGMENTS);
                const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
                atmosphere.name = 'atmosphere-mesh';
                group.add(atmosphere);
                earthRef.current.atmosphere = atmosphere;

                // 保存材质和纹理引用
                earthRef.current.materials.earth = earthMaterial;
                earthRef.current.materials.clouds = cloudsMaterial;
                earthRef.current.materials.atmosphere = atmosphereMaterial;
                earthRef.current.textures.dayMap = dayMap;
                earthRef.current.textures.nightMap = nightMap;
                earthRef.current.textures.bumpMap = bumpMap;
                earthRef.current.textures.specularMap = specularMap;
                earthRef.current.textures.cloudsMap = cloudsMap;

                // 设置灯光
                const ambientLight = new THREE.AmbientLight(LIGHT_PARAMS.AMBIENT_COLOR, LIGHT_PARAMS.AMBIENT_INTENSITY);
                group.add(ambientLight);
                earthRef.current.lights.ambient = ambientLight;

                // 添加额外的环境光来填充阴影
                const fillLight = new THREE.AmbientLight(0x404040, 0.4);
                group.add(fillLight);
                earthRef.current.lights.additionalLights.push(fillLight);

                const directionalLight = new THREE.DirectionalLight(LIGHT_PARAMS.DIRECTIONAL_COLOR, LIGHT_PARAMS.DIRECTIONAL_INTENSITY);
                directionalLight.position.set(...POSITION_PARAMS.DIRECTIONAL_LIGHT);
                directionalLight.castShadow = true;
                directionalLight.shadow.mapSize.width = SHADOW_PARAMS.MAP_SIZE;
                directionalLight.shadow.mapSize.height = SHADOW_PARAMS.MAP_SIZE;
                group.add(directionalLight);
                earthRef.current.lights.directional = directionalLight;

                // 添加额外的灯光以增强效果
                const additionalLight1 = new THREE.DirectionalLight(LIGHT_PARAMS.ADDITIONAL_LIGHT1_COLOR, LIGHT_PARAMS.ADDITIONAL_LIGHT1_INTENSITY);
                additionalLight1.position.set(...POSITION_PARAMS.ADDITIONAL_LIGHT1);
                group.add(additionalLight1);
                earthRef.current.lights.additionalLights.push(additionalLight1);

                const additionalLight2 = new THREE.DirectionalLight(LIGHT_PARAMS.ADDITIONAL_LIGHT2_COLOR, LIGHT_PARAMS.ADDITIONAL_LIGHT2_INTENSITY);
                additionalLight2.position.set(...POSITION_PARAMS.ADDITIONAL_LIGHT2);
                group.add(additionalLight2);
                earthRef.current.lights.additionalLights.push(additionalLight2);

                // 添加一个点光源来填充阴影区域
                const pointLight = new THREE.PointLight(0xffffff, 0.5, 10);
                pointLight.position.set(0, 0, 3);
                group.add(pointLight);
                earthRef.current.lights.additionalLights.push(pointLight);

                // 地球模型加载完成，设置isLoaded为true
                setIsLoaded(true);
                console.log('Earth: 地球模型加载完成，设置isLoaded为true');
            } catch (error) {
                console.error('Earth: 纹理加载失败，使用备用方案', error);

                // 备用方案：创建简单的地球
                const earthMaterial = new THREE.MeshPhongMaterial({
                    color: MATERIAL_PARAMS.FALLBACK_COLOR,
                    shininess: MATERIAL_PARAMS.FALLBACK_SHININESS,
                });

                const earth = new THREE.Mesh(geometry, earthMaterial);
                earth.name = 'earth-mesh-fallback';
                group.add(earth);
                earthRef.current.earth = earth;
                earthRef.current.materials.earth = earthMaterial;

                // 设置基本灯光
                const ambientLight = new THREE.AmbientLight(LIGHT_PARAMS.AMBIENT_COLOR, LIGHT_PARAMS.FALLBACK_AMBIENT_INTENSITY);
                group.add(ambientLight);
                earthRef.current.lights.ambient = ambientLight;

                const directionalLight = new THREE.DirectionalLight(LIGHT_PARAMS.DIRECTIONAL_COLOR, LIGHT_PARAMS.FALLBACK_DIRECTIONAL_INTENSITY);
                directionalLight.position.set(...POSITION_PARAMS.FALLBACK_DIRECTIONAL_LIGHT);
                group.add(directionalLight);
                earthRef.current.lights.directional = directionalLight;

                // 备用地球创建完成，设置isLoaded为true
                setIsLoaded(true);
                console.log('Earth: 备用地球创建完成，设置isLoaded为true');
            }
        };

        // 开始加载纹理
        loadTextures();

        // 清理函数
        return () => {
            // console.log('Earth: 开始清理资源');

            // // 清理几何体
            // if (earthRef.current.geometry) {
            //     earthRef.current.geometry.dispose();
            //     console.log('Earth: 几何体已释放');
            // }

            // // 从场景中移除地球组
            // if (earthRef.current.group && scene) {
            //     scene.remove(earthRef.current.group);
            //     console.log('Earth: 地球组已从场景移除');
            // }

            // // 清理灯光
            // if (earthRef.current.lights) {
            //     earthRef.current.lights.additionalLights.forEach(light => {
            //         if (light && light.parent) {
            //             light.parent.remove(light);
            //             light.dispose();
            //         }
            //     });
            // }

            // earthRef.current = {
            //     group: null,
            //     earth: null,
            //     clouds: null,
            //     atmosphere: null,
            //     lights: {
            //         ambient: null,
            //         directional: null,
            //         additionalLights: [],
            //     },
            //     geometry: null,
            //     materials: {
            //         earth: null,
            //         clouds: null,
            //         atmosphere: null,
            //     },
            //     textures: {
            //         dayMap: null,
            //         nightMap: null,
            //         bumpMap: null,
            //         specularMap: null,
            //         cloudsMap: null,
            //     },
            //     worldRadius,
            //     updateFunctionId: null,
            // };
            // console.log('Earth: 资源清理完成');
        };
    }, [scene, camera, renderer, resourceManager, worldRadius, atmosphereParams]);

    useEffect(() => {
        if (!earthRef.current.group)
            return;
        console.log('Earth: 设置地球位置');
        earthRef.current.group.position.set(0, 0, 0);
        earthRef.current.group.scale.set(1, 1, 1);
        earthRef.current.group.name = 'earth-group';
    }, [earthRef.current.group]);

    // 地球自转效果
    useEffect(() => {
        if (!isRotating || !earthRef.current.group || !resourceManager)
            return;

        let lastTime = 0;

        const updateRotation = (time: number) => {
            if (lastTime === 0) {
                lastTime = time;
            }

            const delta = time - lastTime;
            lastTime = time;

            // 限制更新频率，减少卡顿
            if (delta < EARTH_CONSTANTS.FRAME_RATE_LIMIT) { // 约60fps
                return;
            }

            if (earthRef.current.group) {
                const rotationAmount = EARTH_CONSTANTS.ROTATION_SPEED * delta;
                earthRef.current.group.rotateOnAxis(stableRotationAxis, rotationAmount);
            }
        };

        const updateId = resourceManager.registerUpdateFunction(updateRotation);
        earthRef.current.updateFunctionId = updateId;

        return () => {
            if (earthRef.current.updateFunctionId !== null && resourceManager) {
                resourceManager.unregisterUpdateFunction(earthRef.current.updateFunctionId);
                earthRef.current.updateFunctionId = null;
            }
        };
    }, [isRotating, stableRotationAxis, resourceManager]);

    return null;
};

export default Earth; 