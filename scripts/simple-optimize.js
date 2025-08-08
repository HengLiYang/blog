const fs = require('fs');
const path = require('path');

// 简单的文件复制和重命名优化
function simpleOptimize() {
  console.log('开始简单纹理优化...\n');

  const texturesDir = path.join(__dirname, '..', 'public', 'textures');
  const optimizedDir = path.join(
    __dirname,
    '..',
    'public',
    'textures-optimized'
  );

  // 确保优化目录存在
  if (!fs.existsSync(optimizedDir)) {
    fs.mkdirSync(optimizedDir, { recursive: true });
  }

  // 定义纹理文件列表
  const textureFiles = [
    'Albedo.jpg',
    'Bump.jpg',
    'Clouds.png',
    'night_lights.png',
    'Ocean.png'
  ];

  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;

  textureFiles.forEach((file) => {
    const inputPath = path.join(texturesDir, file);
    const outputPath = path.join(optimizedDir, file);

    if (fs.existsSync(inputPath)) {
      try {
        // 复制文件
        fs.copyFileSync(inputPath, outputPath);

        const originalSize = fs.statSync(inputPath).size;
        const optimizedSize = fs.statSync(outputPath).size;

        totalOriginalSize += originalSize;
        totalOptimizedSize += optimizedSize;

        console.log(`✓ 处理完成: ${file}`);
        console.log(`  大小: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
        console.log('');
      } catch (error) {
        console.error(`✗ 处理失败: ${file}`, error.message);
      }
    } else {
      console.error(`✗ 文件不存在: ${file}`);
    }
  });

  console.log('=== 优化总结 ===');
  console.log(`原始总大小: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(
    `优化后总大小: ${(totalOptimizedSize / 1024 / 1024).toFixed(2)} MB`
  );
  console.log(`优化后的文件保存在: ${optimizedDir}`);

  console.log('\n建议:');
  console.log('1. 手动使用图像编辑软件压缩纹理文件');
  console.log('2. 将PNG文件转换为JPG格式');
  console.log('3. 降低纹理分辨率（建议2048x1024或1024x512）');
  console.log('4. 使用WebP格式替代JPG/PNG');

  console.log('\n手动优化步骤:');
  console.log('1. 打开图像编辑软件（如Photoshop、GIMP、在线工具）');
  console.log('2. 调整图像尺寸到合适大小');
  console.log('3. 压缩图像质量（建议70-80%）');
  console.log('4. 将PNG转换为JPG格式');
  console.log('5. 替换原始文件');
}

// 创建优化建议文件
function createOptimizationGuide() {
  const guidePath = path.join(__dirname, '..', 'TEXTURE_OPTIMIZATION_GUIDE.md');
  const guideContent = `# 纹理优化指南

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
`;

  fs.writeFileSync(guidePath, guideContent);
  console.log('✓ 优化指南已创建: TEXTURE_OPTIMIZATION_GUIDE.md');
}

// 主函数
function main() {
  simpleOptimize();
  createOptimizationGuide();
}

// 运行脚本
if (require.main === module) {
  main();
}

module.exports = { simpleOptimize, createOptimizationGuide };
