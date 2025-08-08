import React, { createContext, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// 实体接口定义
export interface Entity {
    id: string;
    type: string;
    object: THREE.Object3D;
    dispose: () => void;
}

// 实体注册表接口定义
export interface EntityRegistry {
    entities: Map<string, Entity>;
    register: (entity: Entity) => void;
    get: (id: string) => Entity | undefined;
    getByType: (type: string) => Entity[];
    remove: (id: string) => void;
    has: (id: string) => boolean;
    clear: () => void;
}

// 资源管理器接口定义
export interface ResourceManager {
    textureLoader: THREE.TextureLoader;
    loadTexture: (path: string) => Promise<THREE.Texture>;
    registerUpdateFunction: (fn: (time: number) => void) => number;
    unregisterUpdateFunction: (id: number) => void;
    registerForCleanup: (cleanupFn: () => void) => void;
    entityRegistry: EntityRegistry;
}

// 定义上下文类型
export interface SceneContextType {
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    renderer: THREE.WebGLRenderer | null;
    controls: OrbitControls | null;
    isInitialized: boolean;
    isRotating: boolean;
    setIsRotating: (isRotating: boolean) => void;
    resourceManager: ResourceManager | null;
    getEntityRegistry: () => EntityRegistry | null;
    isLoaded: boolean;
    setIsLoaded: (isLoaded: boolean) => void;
}

// 创建上下文
export const SceneContext = createContext<SceneContextType>({
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    isInitialized: false,
    isRotating: false,
    setIsRotating: () => { },
    resourceManager: null,
    getEntityRegistry: () => null,
    isLoaded: false,
    setIsLoaded: () => { },
});

export interface SceneProviderProps {
    children: React.ReactNode;
    containerRef: React.RefObject<HTMLDivElement>;
}

export const SceneProvider: React.FC<SceneProviderProps> = ({ children, containerRef }) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [isRotating, setIsRotating] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);
    const [initializationError, setInitializationError] = useState<string | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    const updateFunctionsRef = useRef<Map<number, (time: number) => void>>(new Map());
    const cleanupFunctionsRef = useRef<Array<() => void>>([]);
    const nextUpdateIdRef = useRef<number>(1);

    // 实体注册表实现
    const entityRegistryRef = useRef<EntityRegistry>({
        entities: new Map<string, Entity>(),
        register(entity: Entity): void {
            if (this.entities.has(entity.id)) {
                console.warn(`SceneProvider: 实体ID冲突，已存在ID为 ${entity.id} 的实体，将被替换`);
                const oldEntity = this.entities.get(entity.id);
                if (oldEntity && oldEntity.object.parent) {
                    oldEntity.object.parent.remove(oldEntity.object);
                    oldEntity.dispose();
                }
            }
            this.entities.set(entity.id, entity);
            console.log(`SceneProvider: 注册实体 [${entity.type}] ID: ${entity.id}`);
        },
        get(id: string): Entity | undefined {
            return this.entities.get(id);
        },
        getByType(type: string): Entity[] {
            const result: Entity[] = [];
            this.entities.forEach((entity) => {
                if (entity.type === type) {
                    result.push(entity);
                }
            });
            return result;
        },
        remove(id: string): void {
            const entity = this.entities.get(id);
            if (entity) {
                if (entity.object.parent) {
                    entity.object.parent.remove(entity.object);
                }
                entity.dispose();
                this.entities.delete(id);
                console.log(`SceneProvider: 移除实体 ID: ${id}`);
            }
        },
        has(id: string): boolean {
            return this.entities.has(id);
        },
        clear(): void {
            const entityIds = Array.from(this.entities.keys());
            entityIds.forEach(id => this.remove(id));
            console.log(`SceneProvider: 清空所有实体`);
        },
    } as EntityRegistry);

    const resourceManagerRef = useRef<ResourceManager | null>(null);

    // 窗口大小变化监听器
    const handleResize = useCallback(() => {
        if (!containerRef.current || !rendererRef.current || !cameraRef.current)
            return;

        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        const panelWidth = 380;
        const viewportWidth = Math.max(width - panelWidth, 1);

        cameraRef.current.aspect = viewportWidth / height;
        cameraRef.current.updateProjectionMatrix();

        rendererRef.current.setSize(width, height);
        rendererRef.current.setViewport(panelWidth, 0, viewportWidth, height);
    }, [containerRef]);

    // 初始化Three.js环境
    useEffect(() => {
        try {
            if (!containerRef.current) {
                console.log('SceneProvider: 容器元素不可用，等待DOM加载');
                return;
            }

            // 检查WebGL支持
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (!gl) {
                const error = 'WebGL不受支持，无法初始化3D场景';
                console.error(error);
                setInitializationError(error);
                return;
            }

            // 创建场景
            const scene = new THREE.Scene();
            scene.background = new THREE.Color(0x000000);
            sceneRef.current = scene;

            const width = containerRef.current.clientWidth;
            const height = containerRef.current.clientHeight;
            const panelWidth = 380; // 左侧面板宽度
            const viewportWidth = Math.max(width - panelWidth, 1); // 确保视口宽度不为负数

            // 创建相机
            const camera = new THREE.PerspectiveCamera(
                40,
                viewportWidth / height,
                0.1,
                2000,
            );
            cameraRef.current = camera;

            // 创建渲染器，添加性能优化
            const renderer = new THREE.WebGLRenderer({
                antialias: true,
                powerPreference: "high-performance",
                stencil: false,
                depth: true,
                alpha: false
            });

            // 设置渲染器性能优化
            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 限制像素比
            renderer.setViewport(panelWidth, 0, viewportWidth, height);
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            renderer.outputColorSpace = THREE.SRGBColorSpace;
            renderer.toneMapping = THREE.NoToneMapping;
            renderer.toneMappingExposure = 1.0;

            // 添加性能优化
            renderer.info.autoReset = false; // 禁用自动重置，提高性能

            containerRef.current.appendChild(renderer.domElement);
            rendererRef.current = renderer;

            console.log('SceneProvider: 渲染器设置完成', {
                shadowMapEnabled: renderer.shadowMap.enabled,
                outputColorSpace: renderer.outputColorSpace,
                toneMapping: renderer.toneMapping,
                toneMappingExposure: renderer.toneMappingExposure,
                pixelRatio: renderer.getPixelRatio()
            });

            // 创建控制器
            const controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.minDistance = 3;
            controls.maxDistance = 8;
            controls.enablePan = false;
            controls.rotateSpeed = 0.5;
            controls.zoomSpeed = 0.5;
            controlsRef.current = controls;

            // 创建资源管理器
            const textureLoader = new THREE.TextureLoader();

            resourceManagerRef.current = {
                textureLoader,

                loadTexture: (path: string): Promise<THREE.Texture> => {
                    return new Promise((resolve, reject) => {
                        // 添加重试机制
                        let retryCount = 0;
                        const maxRetries = 3;

                        const attemptLoad = () => {
                            textureLoader.load(
                                path,
                                (texture) => {
                                    if (rendererRef.current) {
                                        texture.anisotropy = Math.min(4, rendererRef.current.capabilities.getMaxAnisotropy());
                                    }
                                    if (path.includes('Albedo') || path.includes('night_lights')) {
                                        texture.colorSpace = THREE.SRGBColorSpace;
                                    }
                                    // 启用纹理压缩
                                    texture.generateMipmaps = true;
                                    texture.minFilter = THREE.LinearMipmapLinearFilter;
                                    texture.magFilter = THREE.LinearFilter;
                                    resolve(texture);
                                },
                                (progress) => {
                                    console.log(`SceneProvider: 纹理加载进度: ${path} - ${progress.loaded}/${progress.total}`);
                                },
                                (error) => {
                                    console.error(`SceneProvider: 纹理加载失败: ${path}`, error);
                                    if (retryCount < maxRetries) {
                                        retryCount++;
                                        console.log(`SceneProvider: 重试加载纹理 ${path} (${retryCount}/${maxRetries})`);
                                        setTimeout(attemptLoad, 1000 * retryCount); // 递增延迟
                                    } else {
                                        reject(error);
                                    }
                                }
                            );
                        };

                        attemptLoad();
                    });
                },

                registerUpdateFunction: (fn: (time: number) => void): number => {
                    const id = nextUpdateIdRef.current++;
                    updateFunctionsRef.current.set(id, fn);
                    console.log(`SceneProvider: 已注册更新函数 ID: ${id}`);
                    return id;
                },

                unregisterUpdateFunction: (id: number): void => {
                    updateFunctionsRef.current.delete(id);
                    console.log(`SceneProvider: 已注销更新函数 ID: ${id}`);
                },

                registerForCleanup: (cleanupFn: () => void): void => {
                    cleanupFunctionsRef.current.push(cleanupFn);
                    console.log('SceneProvider: 已注册清理函数');
                },

                entityRegistry: entityRegistryRef.current,
            };

            window.addEventListener('resize', handleResize);

            // 动画循环 - 优化性能
            let lastTime = 0;
            const targetFPS = 60;
            const frameInterval = 1000 / targetFPS;
            let frameCount = 0;
            let lastFPSUpdate = 0;

            const animate = (time: number) => {
                animationFrameRef.current = requestAnimationFrame(animate);

                const deltaTime = time - lastTime;
                if (deltaTime < frameInterval) {
                    return;
                }
                lastTime = time;

                // 更新FPS计数
                frameCount++;
                if (time - lastFPSUpdate >= 1000) {
                    const fps = Math.round((frameCount * 1000) / (time - lastFPSUpdate));
                    if (fps < 30) {
                        console.warn(`SceneProvider: 低帧率警告 - ${fps} FPS`);
                    }
                    frameCount = 0;
                    lastFPSUpdate = time;
                }

                if (controlsRef.current) {
                    controlsRef.current.update();
                }

                updateFunctionsRef.current.forEach((fn) => {
                    try {
                        fn(time);
                    } catch (error) {
                        console.error('SceneProvider: 更新函数执行错误', error);
                    }
                });

                if (rendererRef.current && sceneRef.current && cameraRef.current) {
                    rendererRef.current.render(sceneRef.current, cameraRef.current);
                }
            };

            animate(0);

            setIsInitialized(true);
            setInitializationError(null);
            console.log('SceneProvider: Three.js环境初始化完成');

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '初始化失败';
            console.error('SceneProvider: 初始化错误', error);
            setInitializationError(errorMessage);
        }

        return () => {
            console.log('SceneProvider: 开始清理Three.js资源');

            window.removeEventListener('resize', handleResize);

            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
                console.log('SceneProvider: 动画帧已取消');
            }

            if (resourceManagerRef.current && resourceManagerRef.current.entityRegistry) {
                console.log(`SceneProvider: 清理所有注册的实体`);
                resourceManagerRef.current.entityRegistry.clear();
            }

            console.log(`SceneProvider: 执行 ${cleanupFunctionsRef.current.length} 个注册的清理函数`);
            cleanupFunctionsRef.current.forEach((cleanupFn) => {
                try {
                    cleanupFn();
                }
                catch (e) {
                    console.error('执行清理函数时出错:', e);
                }
            });

            updateFunctionsRef.current.clear();
            cleanupFunctionsRef.current = [];

            if (rendererRef.current) {
                try {
                    if (containerRef.current && containerRef.current.contains(rendererRef.current.domElement)) {
                        containerRef.current.removeChild(rendererRef.current.domElement);
                        console.log('SceneProvider: 渲染器DOM元素已移除');
                    }
                }
                catch (e) {
                    console.error('移除渲染器DOM元素时出错:', e);
                }
                rendererRef.current.dispose();
                rendererRef.current.forceContextLoss();
                rendererRef.current = null;
                console.log('SceneProvider: 渲染器已释放');
            }

            if (controlsRef.current) {
                controlsRef.current.dispose();
                controlsRef.current = null;
                console.log('SceneProvider: 控制器已释放');
            }

            sceneRef.current = null;
            cameraRef.current = null;
            resourceManagerRef.current = null;

            console.log('SceneProvider: Three.js资源清理完成');
        };
    }, [containerRef]);

    const contextValue = useMemo<SceneContextType>(() => ({
        scene: sceneRef.current,
        camera: cameraRef.current,
        renderer: rendererRef.current,
        controls: controlsRef.current,
        isInitialized,
        resourceManager: resourceManagerRef.current,
        isRotating,
        setIsRotating,
        getEntityRegistry: () => resourceManagerRef.current?.entityRegistry || null,
        isLoaded,
        setIsLoaded,
    }), [isInitialized, isRotating, isLoaded]);

    // 如果初始化失败，显示错误信息
    if (initializationError) {
        return (
            <div className="error-container">
                <div className="error-message">
                    <h3>初始化失败</h3>
                    <p>{initializationError}</p>
                    <button onClick={() => window.location.reload()}>重新加载</button>
                </div>
            </div>
        );
    }

    return (
        <SceneContext.Provider value={contextValue}>
            {children}
        </SceneContext.Provider>
    );
};

export default SceneProvider; 