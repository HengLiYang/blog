import type React from 'react';
import { useContext, useEffect, useRef, useMemo, useState } from 'react';
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
} from '../../../lib/satellite-constants';

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
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [loadingError, setLoadingError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

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

        // 重置状态
        setLoadingError(null);
        setLoadingProgress(0);
        setIsLoading(true);
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

                // 创建加载进度跟踪
                let loadedCount = 0;
                const totalTextures = 5;

                const updateProgress = () => {
                    loadedCount++;
                    const progress = (loadedCount / totalTextures) * 100;
                    setLoadingProgress(progress);
                    console.log(`Earth: 纹理加载进度 ${progress.toFixed(1)}%`);
                };

                // 设置纹理加载超时
                const textureLoadTimeout = 30000; // 30秒超时

                const loadTextureWithTimeout = (path: string, timeout: number) => {
                    return Promise.race([
                        resourceManager.loadTexture(path),
                        new Promise<THREE.Texture>((_, reject) =>
                            setTimeout(() => reject(new Error(`纹理加载超时: ${path}`)), timeout)
                        )
                    ]);
                };

                console.log('Earth: 开始加载纹理文件，路径:', {
                    ALBEDO: TEXTURE_PATHS.ALBEDO,
                    NIGHT_LIGHTS: TEXTURE_PATHS.NIGHT_LIGHTS,
                    BUMP: TEXTURE_PATHS.BUMP,
                    CLOUDS: TEXTURE_PATHS.CLOUDS
                });

                // 并行加载纹理，但添加错误处理
                const texturePromises = [
                    loadTextureWithTimeout(TEXTURE_PATHS.ALBEDO, textureLoadTimeout)
                        .then(texture => { updateProgress(); return texture; })
                        .catch(error => {
                            console.error('Earth: Albedo纹理加载失败，使用备用方案', error);
                            return null;
                        }),
                    loadTextureWithTimeout(TEXTURE_PATHS.NIGHT_LIGHTS, textureLoadTimeout)
                        .then(texture => { updateProgress(); return texture; })
                        .catch(error => {
                            console.error('Earth: Night lights纹理加载失败，使用备用方案', error);
                            return null;
                        }),
                    loadTextureWithTimeout(TEXTURE_PATHS.BUMP, textureLoadTimeout)
                        .then(texture => { updateProgress(); return texture; })
                        .catch(error => {
                            console.error('Earth: Bump纹理加载失败，使用备用方案', error);
                            return null;
                        }),
                    loadTextureWithTimeout('/textures/Ocean.png', textureLoadTimeout)
                        .then(texture => { updateProgress(); return texture; })
                        .catch(error => {
                            console.error('Earth: Ocean纹理加载失败，使用备用方案', error);
                            return null;
                        }),
                    loadTextureWithTimeout(TEXTURE_PATHS.CLOUDS, textureLoadTimeout)
                        .then(texture => { updateProgress(); return texture; })
                        .catch(error => {
                            console.error('Earth: Clouds纹理加载失败，使用备用方案', error);
                            return null;
                        }),
                ];

                const [dayMap, nightMap, bumpMap, specularMap, cloudsMap] = await Promise.all(texturePromises);

                console.log('Earth: 纹理加载完成');

                // 检查是否有纹理加载失败
                const hasTextures = dayMap && nightMap && bumpMap && specularMap && cloudsMap;

                if (!hasTextures) {
                    console.warn('Earth: 部分纹理加载失败，使用简化版本');
                }

                // 设置纹理属性（如果存在）
                if (dayMap) {
                    dayMap.wrapS = THREE.ClampToEdgeWrapping;
                    dayMap.wrapT = THREE.ClampToEdgeWrapping;
                    dayMap.colorSpace = THREE.SRGBColorSpace;
                }

                if (bumpMap) {
                    bumpMap.wrapS = THREE.ClampToEdgeWrapping;
                    bumpMap.wrapT = THREE.ClampToEdgeWrapping;
                    bumpMap.colorSpace = THREE.NoColorSpace;
                }

                if (specularMap) {
                    specularMap.wrapS = THREE.ClampToEdgeWrapping;
                    specularMap.wrapT = THREE.ClampToEdgeWrapping;
                    specularMap.colorSpace = THREE.NoColorSpace;
                }

                // 创建地球材质 - 根据纹理可用性调整
                const earthMaterial = new THREE.MeshPhongMaterial({
                    map: dayMap || undefined,
                    bumpMap: bumpMap || undefined,
                    bumpScale: bumpMap ? MATERIAL_PARAMS.BUMP_SCALE : 0,
                    specularMap: specularMap || undefined,
                    specular: new THREE.Color(0x2266aa),
                    shininess: 25,
                    emissive: new THREE.Color(0xFFAC00),
                    emissiveMap: nightMap || undefined,
                    emissiveIntensity: nightMap ? 3.5 : 0,
                    color: dayMap ? new THREE.Color(0xf0f8ff) : MATERIAL_PARAMS.FALLBACK_COLOR,
                });

                // 创建云层材质（如果云层纹理可用）
                let cloudsMaterial: THREE.MeshPhongMaterial | null = null;
                if (cloudsMap) {
                    cloudsMaterial = new THREE.MeshPhongMaterial({
                        map: cloudsMap,
                        transparent: true,
                        opacity: MATERIAL_PARAMS.CLOUDS_OPACITY,
                    });
                }

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
                earth.renderOrder = 1;
                group.add(earth);
                earthRef.current.earth = earth;

                // 创建云层网格（如果材质可用）
                if (cloudsMaterial) {
                    const cloudsGeometry = new THREE.SphereGeometry(worldRadius + EARTH_CONSTANTS.CLOUDS_OFFSET, EARTH_CONSTANTS.GEOMETRY_SEGMENTS, EARTH_CONSTANTS.GEOMETRY_SEGMENTS);
                    const clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
                    clouds.name = 'clouds-mesh';
                    group.add(clouds);
                    earthRef.current.clouds = clouds;
                }

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

                // 地球模型加载完成
                setIsLoading(false);
                setIsLoaded(true);
                setLoadingProgress(100);
                console.log('Earth: 地球模型加载完成');
            } catch (error) {
                console.error('Earth: 纹理加载失败，使用备用方案', error);
                setLoadingError(error instanceof Error ? error.message : '未知错误');

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

                // 备用地球创建完成
                setIsLoading(false);
                setIsLoaded(true);
                setLoadingProgress(100);
                console.log('Earth: 备用地球创建完成');
            }
        };

        // 开始加载纹理
        loadTextures();

        // 清理函数
        return () => {
            setIsLoading(false);
            setLoadingProgress(0);
            setLoadingError(null);
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
            if (delta < EARTH_CONSTANTS.FRAME_RATE_LIMIT) {
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