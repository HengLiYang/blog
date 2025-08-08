# 纹理优化指南

## 当前纹理文件大小
- Albedo.jpg: 4.2MB
- Bump.jpg: 2.2MB  
- Clouds.png: 7.8MB
- night_lights.png: 1.4MB
- Ocean.png: 673KB

## 优化目标
- 总大小 < 5MB
- 单个文件 < 1MB
- 保持视觉质量

## 手动优化步骤

### 1. 使用在线工具
推荐使用以下在线工具：
- TinyPNG (https://tinypng.com/)
- Squoosh (https://squoosh.app/)
- ImageOptim (https://imageoptim.com/)

### 2. 优化参数建议
- **Albedo.jpg**: 2048x1024, 质量80%, JPG格式
- **Bump.jpg**: 2048x1024, 质量75%, JPG格式  
- **Clouds.png**: 1024x512, 质量70%, JPG格式
- **night_lights.png**: 1024x512, 质量80%, JPG格式
- **Ocean.png**: 1024x512, 质量75%, JPG格式

### 3. 优化后预期大小
- Albedo.jpg: ~800KB
- Bump.jpg: ~600KB
- Clouds.jpg: ~400KB
- night_lights.jpg: ~300KB
- Ocean.jpg: ~200KB
- **总计**: ~2.3MB

## 代码更新
优化完成后，更新以下文件中的纹理路径：
- lib/satellite-constants.ts
- pages/Satellite/components/Earth.tsx

## 测试
1. 本地测试加载速度
2. 部署测试网络加载
3. 检查视觉效果
4. 验证性能提升
