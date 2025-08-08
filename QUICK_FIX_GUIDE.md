# 卫星页面部署问题快速修复指南

## 问题症状

- 部署后地球一直显示"正在加载中"
- 页面感觉特别卡
- 本地开发环境正常

## 快速修复步骤

### 1. 立即解决方案（无需修改纹理文件）

#### 步骤 1: 启用低质量模式

编辑 `lib/satellite-constants.ts`，将 `USE_LOW_QUALITY` 改为 `true`：

```typescript
export const TEXTURE_CONFIG = {
  USE_LOW_QUALITY: true, // 改为 true
  LOAD_TIMEOUT: 30000,
  MAX_RETRIES: 3,
  ENABLE_COMPRESSION: true
} as const;
```

#### 步骤 2: 减少几何体复杂度

编辑 `lib/satellite-constants.ts`，降低几何体分段数：

```typescript
export const EARTH_CONSTANTS = {
  DEFAULT_RADIUS: 1.5,
  GEOMETRY_SEGMENTS: 16 // 从 24 降低到 16
  // ... 其他配置
} as const;
```

#### 步骤 3: 禁用云层（可选）

编辑 `pages/Satellite/components/Earth.tsx`，注释掉云层相关代码：

```typescript
// 创建云层网格（如果材质可用）
// if (cloudsMaterial) {
//     const cloudsGeometry = new THREE.SphereGeometry(worldRadius + EARTH_CONSTANTS.CLOUDS_OFFSET, EARTH_CONSTANTS.GEOMETRY_SEGMENTS, EARTH_CONSTANTS.GEOMETRY_SEGMENTS);
//     const clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
//     clouds.name = 'clouds-mesh';
//     group.add(clouds);
//     earthRef.current.clouds = clouds;
// }
```

### 2. 重新构建和部署

```bash
# 清理缓存
rm -rf .next
rm -rf out
rm -rf docs

# 重新构建
npm run build

# 测试本地
npm run dev
```

### 3. 验证修复

1. 打开浏览器开发者工具
2. 访问卫星页面
3. 检查控制台是否有错误
4. 观察地球是否正常加载
5. 点击性能监控按钮（📊）查看 FPS

## 长期优化方案

### 1. 纹理压缩（推荐）

使用在线工具压缩纹理文件：

1. 访问 https://tinypng.com/
2. 上传所有纹理文件
3. 下载压缩后的文件
4. 替换 `public/textures/` 目录中的文件

### 2. 手动优化纹理

使用图像编辑软件：

1. **Albedo.jpg**: 调整到 2048x1024，质量 80%
2. **Bump.jpg**: 调整到 2048x1024，质量 75%
3. **Clouds.png**: 转换为 JPG，1024x512，质量 70%
4. **night_lights.png**: 转换为 JPG，1024x512，质量 80%
5. **Ocean.png**: 调整到 1024x512，质量 75%

### 3. 使用 WebP 格式

将纹理转换为 WebP 格式以获得更好的压缩率：

```bash
# 使用在线工具或命令行工具
# 例如：https://convertio.co/jpg-webp/
```

## 调试步骤

### 1. 检查网络请求

1. 打开开发者工具 → Network
2. 刷新页面
3. 查看纹理文件加载情况
4. 检查是否有 404 错误

### 2. 检查控制台错误

1. 打开开发者工具 → Console
2. 查看错误信息
3. 特别注意纹理加载相关错误

### 3. 性能监控

1. 点击页面右上角的 📊 按钮
2. 查看 FPS 是否正常（>30）
3. 检查内存使用情况

## 常见问题解决

### 问题 1: 纹理加载超时

**解决**: 增加超时时间或使用低质量模式

### 问题 2: WebGL 不支持

**解决**: 更新显卡驱动或尝试不同浏览器

### 问题 3: 内存不足

**解决**: 降低几何体复杂度或禁用云层

### 问题 4: 网络问题

**解决**: 使用 CDN 或压缩纹理文件

## 性能优化建议

1. **启用纹理压缩**: 使用压缩后的纹理文件
2. **降低几何体复杂度**: 减少分段数
3. **禁用不必要的效果**: 如云层、大气层
4. **使用低质量模式**: 在慢网络环境下
5. **启用缓存**: 确保纹理文件被正确缓存

## 监控和维护

1. **定期检查性能**: 使用性能监控工具
2. **监控错误**: 设置错误监控
3. **用户反馈**: 收集用户使用反馈
4. **持续优化**: 根据使用情况调整

## 联系支持

如果问题仍然存在，请提供：

1. 浏览器版本和操作系统
2. 控制台错误信息
3. 网络请求日志
4. 性能监控数据
5. 设备配置信息
