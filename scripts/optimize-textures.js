const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 检查是否安装了ImageMagick
function checkImageMagick() {
  try {
    execSync('convert --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    console.error('错误: 未找到ImageMagick。请先安装ImageMagick:');
    console.error('macOS: brew install imagemagick');
    console.error('Ubuntu: sudo apt-get install imagemagick');
    console.error('Windows: 下载并安装ImageMagick');
    return false;
  }
}

// 优化纹理文件
function optimizeTexture(inputPath, outputPath, options = {}) {
  const { quality = 85, resize = null, format = 'jpg' } = options;

  const inputDir = path.dirname(inputPath);
  const inputFile = path.basename(inputPath);
  const outputDir = path.dirname(outputPath);
  const outputFile = path.basename(outputPath);

  // 确保输出目录存在
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  let command = `convert "${inputPath}"`;

  // 添加调整大小参数
  if (resize) {
    command += ` -resize ${resize}`;
  }

  // 添加质量参数
  if (format === 'jpg') {
    command += ` -quality ${quality}`;
  }

  // 添加输出格式
  command += ` "${outputPath}"`;

  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✓ 优化完成: ${inputFile} -> ${outputFile}`);

    // 显示文件大小对比
    const originalSize = fs.statSync(inputPath).size;
    const optimizedSize = fs.statSync(outputPath).size;
    const reduction = (
      ((originalSize - optimizedSize) / originalSize) *
      100
    ).toFixed(1);

    console.log(`  原始大小: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  优化后: ${(optimizedSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  压缩率: ${reduction}%`);
  } catch (error) {
    console.error(`✗ 优化失败: ${inputFile}`, error.message);
  }
}

// 主函数
function main() {
  if (!checkImageMagick()) {
    process.exit(1);
  }

  console.log('开始优化纹理文件...\n');

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

  // 定义纹理优化配置
  const textureConfigs = [
    {
      input: 'Albedo.jpg',
      output: 'Albedo.jpg',
      options: { quality: 80, resize: '2048x1024' }
    },
    {
      input: 'Bump.jpg',
      output: 'Bump.jpg',
      options: { quality: 75, resize: '2048x1024' }
    },
    {
      input: 'Clouds.png',
      output: 'Clouds.jpg',
      options: { quality: 70, resize: '1024x512' }
    },
    {
      input: 'night_lights.png',
      output: 'night_lights.jpg',
      options: { quality: 80, resize: '1024x512' }
    },
    {
      input: 'Ocean.png',
      output: 'Ocean.jpg',
      options: { quality: 75, resize: '1024x512' }
    }
  ];

  // 处理每个纹理文件
  textureConfigs.forEach((config) => {
    const inputPath = path.join(texturesDir, config.input);
    const outputPath = path.join(optimizedDir, config.output);

    if (fs.existsSync(inputPath)) {
      console.log(`处理: ${config.input}`);
      optimizeTexture(inputPath, outputPath, config.options);
      console.log('');
    } else {
      console.error(`✗ 文件不存在: ${config.input}`);
    }
  });

  console.log('纹理优化完成！');
  console.log(`优化后的文件保存在: ${optimizedDir}`);
  console.log('\n建议:');
  console.log('1. 测试优化后的纹理文件');
  console.log('2. 如果质量满意，可以替换原始文件');
  console.log('3. 更新代码中的纹理路径');
}

// 运行脚本
if (require.main === module) {
  main();
}

module.exports = { optimizeTexture, checkImageMagick };
