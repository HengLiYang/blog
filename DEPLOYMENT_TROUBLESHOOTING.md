# 卫星页面部署问题排查指南

## 问题描述

部署后卫星页面访问时，地球一直显示在加载中，并且感觉特别卡，但本地开发环境正常。

## 可能原因分析

### 1. 纹理文件过大

- **问题**: 纹理文件非常大（Albedo.jpg 4.2MB，Clouds.png 7.8MB）
- **影响**: 在部署环境中加载会很慢，特别是在网络较慢的情况下
- **解决方案**: 使用纹理压缩和优化

### 2. 缺少错误处理

- **问题**: 纹理加载失败时没有合适的错误处理
- **影响**: 加载失败时用户看不到任何反馈
- **解决方案**: 添加完善的错误处理和备用方案

### 3. 性能优化不足

- **问题**: 没有针对部署环境进行性能优化
- **影响**: 在性能较差的设备上运行缓慢
- **解决方案**: 添加性能监控和优化

## 解决方案

### 1. 纹理优化

运行纹理优化脚本：

```bash
npm run optimize-textures
```

或者手动优化：

```bash
# 安装ImageMagick
brew install imagemagick  # macOS
sudo apt-get install imagemagick  # Ubuntu

# 运行优化脚本
node scripts/optimize-textures.js
```

### 2. 使用优化后的构建

```bash
npm run build-optimized
```

### 3. 性能监控

页面右上角有性能监控按钮（📊），点击可以查看：

- 帧率（FPS）
- 内存使用情况
- 渲染统计

### 4. 调试步骤

#### 步骤 1: 检查控制台错误

1. 打开浏览器开发者工具
2. 查看 Console 标签页
3. 查找任何错误信息

#### 步骤 2: 检查网络请求

1. 打开 Network 标签页
2. 刷新页面
3. 查看纹理文件的加载情况
4. 检查是否有 404 错误

#### 步骤 3: 检查 WebGL 支持

1. 在控制台运行：`console.log(THREE.WEBGL.isWebGLAvailable())`
2. 如果返回 false，说明 WebGL 不受支持

#### 步骤 4: 性能分析

1. 点击性能监控按钮
2. 查看 FPS 是否低于 30
3. 检查内存使用是否过高

### 5. 常见问题及解决方法

#### 问题 1: 纹理加载超时

**症状**: 控制台显示纹理加载超时错误
**解决**:

- 检查网络连接
- 使用优化后的纹理文件
- 增加超时时间（在 Earth.tsx 中修改 textureLoadTimeout）

#### 问题 2: WebGL 不支持

**症状**: 页面显示"WebGL 不受支持"错误
**解决**:

- 更新显卡驱动
- 启用硬件加速
- 尝试不同的浏览器

#### 问题 3: 内存不足

**症状**: 页面卡顿，性能监控显示高内存使用
**解决**:

- 减少纹理分辨率
- 降低几何体复杂度
- 启用纹理压缩

#### 问题 4: 低帧率

**症状**: FPS 低于 30
**解决**:

- 降低渲染质量
- 减少灯光数量
- 优化几何体

### 6. 代码优化建议

#### 纹理加载优化

```typescript
// 添加重试机制
const loadTextureWithTimeout = (path: string, timeout: number) => {
  return Promise.race([
    resourceManager.loadTexture(path),
    new Promise<THREE.Texture>((_, reject) =>
      setTimeout(() => reject(new Error(`纹理加载超时: ${path}`)), timeout)
    )
  ]);
};
```

#### 性能监控

```typescript
// 监控FPS
if (fps < 30) {
  console.warn(`低帧率警告 - ${fps} FPS`);
}
```

#### 错误处理

```typescript
// 添加备用方案
if (!hasTextures) {
  console.warn('部分纹理加载失败，使用简化版本');
  // 使用基础材质
}
```

### 7. 部署检查清单

- [ ] 纹理文件已优化（大小 < 1MB）
- [ ] 添加了错误处理
- [ ] 添加了性能监控
- [ ] 测试了不同网络环境
- [ ] 测试了不同设备
- [ ] 检查了 WebGL 支持
- [ ] 验证了备用方案

### 8. 性能优化配置

在`next.config.js`中添加：

```javascript
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  output: 'export',
  trailingSlash: true,
  // 添加性能优化
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['three', '@react-three/fiber']
  }
};
```

### 9. 监控和维护

1. **定期检查性能**: 使用性能监控工具
2. **监控错误**: 设置错误监控
3. **用户反馈**: 收集用户使用反馈
4. **定期优化**: 根据使用情况持续优化

## 联系支持

如果问题仍然存在，请提供以下信息：

1. 浏览器版本和操作系统
2. 控制台错误信息
3. 网络请求日志
4. 性能监控数据
5. 设备配置信息
