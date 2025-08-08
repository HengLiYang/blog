// 地球常量定义
export const EARTH_CONSTANTS = {
    DEFAULT_RADIUS: 1.5,
    GEOMETRY_SEGMENTS: 24,
    CLOUDS_OFFSET: 0.01,
    ATMOSPHERE_OFFSET: 0.1,
    ROTATION_SPEED: 0.00001,
    FRAME_RATE_LIMIT: 16, // 约60fps
} as const;

// 大气层参数
export const ATMOSPHERE_PARAMS = {
    ATM_OPACITY: 0.4,
    ATM_POW_FACTOR: 4.1,
    ATM_MULTIPLIER: 9.5,
} as const;

// 材质参数
export const MATERIAL_PARAMS = {
    BUMP_SCALE: 0.1,
    SPECULAR_COLOR: 0x666666,
    SHININESS: 25,
    CLOUDS_OPACITY: 0.4,
    FALLBACK_COLOR: 0x4a90e2,
    FALLBACK_SHININESS: 30,
} as const;

// 灯光参数
export const LIGHT_PARAMS = {
    AMBIENT_COLOR: 0x606060,  // 更亮的环境光颜色
    AMBIENT_INTENSITY: 1.5,    // 进一步增加环境光强度
    DIRECTIONAL_COLOR: 0xffffff,
    DIRECTIONAL_INTENSITY: 0.8,  // 减少方向光强度
    ADDITIONAL_LIGHT1_COLOR: 0x404040,
    ADDITIONAL_LIGHT1_INTENSITY: 0.6,
    ADDITIONAL_LIGHT2_COLOR: 0x404040,
    ADDITIONAL_LIGHT2_INTENSITY: 0.4,
    FALLBACK_AMBIENT_INTENSITY: 0.6,
    FALLBACK_DIRECTIONAL_INTENSITY: 0.8,
} as const;

// 位置参数
export const POSITION_PARAMS = {
    DIRECTIONAL_LIGHT: [0, 0, 5] as [number, number, number],  // 从正面照射
    ADDITIONAL_LIGHT1: [5, 0, 0] as [number, number, number],  // 从右侧照射
    ADDITIONAL_LIGHT2: [-5, 0, 0] as [number, number, number], // 从左侧照射
    FALLBACK_DIRECTIONAL_LIGHT: [5, 3, 5] as [number, number, number],
} as const;

// 阴影参数
export const SHADOW_PARAMS = {
    MAP_SIZE: 1024,
} as const;

// 初始旋转参数
export const INITIAL_ROTATION = {
    X: Math.PI * 0,
    Y: Math.PI * 0,  // 移除初始旋转，让地球正面朝向光源
    Z: 0,
} as const;

// 着色器代码
export const SHADERS = {
    FRESNEL_VERTEX: `
        varying vec3 vNormal;
        varying vec3 eyeVector;
        
        void main() {
            vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
            vNormal = normalize(normalMatrix * normal);
            eyeVector = normalize(mvPos.xyz);
            gl_Position = projectionMatrix * mvPos;
        }
    `,

    FRESNEL_FRAGMENT: `
        uniform float fresnelAmount;
        varying vec3 vNormal;
        varying vec3 eyeVector;
        
        void main() {
            float rim = 1.0 - abs(dot(vNormal, eyeVector));
            vec3 rimColor = vec3(0.3, 0.4, 0.7);
            gl_FragColor = vec4(rimColor, rim * fresnelAmount);
        }
    `,

    ATMOSPHERE_VERTEX: `
        varying vec3 vNormal;
        varying vec3 eyeVector;
        
        void main() {
            vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
            vNormal = normalize(normalMatrix * normal);
            eyeVector = normalize(mvPos.xyz);
            gl_Position = projectionMatrix * mvPos;
        }
    `,

    ATMOSPHERE_FRAGMENT: `
        varying vec3 vNormal;
        varying vec3 eyeVector;
        uniform float atmOpacity;
        uniform float atmPowFactor;
        uniform float atmMultiplier;
        
        void main() {
            float dotP = dot(vNormal, eyeVector);
            float factor = pow(dotP, atmPowFactor) * atmMultiplier;
            
            vec3 atmColor = vec3(0.27 + dotP/15.0, 0.35 + dotP/15.0, 0.5 + dotP/12.0);
            
            gl_FragColor = vec4(atmColor, atmOpacity) * factor;
        }
    `,
} as const;

// 纹理路径 - 添加低质量备用方案
export const TEXTURE_PATHS = {
    // 高质量纹理（原始）
    ALBEDO: '/textures/Albedo.jpg',
    NIGHT_LIGHTS: '/textures/night_lights.png',
    BUMP: '/textures/Bump.jpg',
    CLOUDS: '/textures/Clouds.png',

    // 低质量备用纹理（如果高质量纹理加载失败）
    ALBEDO_LOW: '/textures/Albedo.jpg', // 暂时使用相同路径，后续可替换为压缩版本
    NIGHT_LIGHTS_LOW: '/textures/night_lights.png',
    BUMP_LOW: '/textures/Bump.jpg',
    CLOUDS_LOW: '/textures/Clouds.png',
} as const;

// 纹理加载配置
export const TEXTURE_CONFIG = {
    // 是否使用低质量纹理（用于快速加载）
    USE_LOW_QUALITY: false,

    // 纹理加载超时时间（毫秒）
    LOAD_TIMEOUT: 30000,

    // 重试次数
    MAX_RETRIES: 3,

    // 是否启用纹理压缩
    ENABLE_COMPRESSION: true,
} as const; 