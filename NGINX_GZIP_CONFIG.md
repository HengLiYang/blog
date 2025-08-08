# Nginx Gzip 压缩配置指南

## 为什么在 Nginx 配置 Gzip？

1. **服务器端压缩更高效**: Nginx 可以实时压缩文件，减少带宽使用
2. **自动处理**: 无需在应用代码中处理压缩
3. **更好的缓存**: 压缩后的文件可以被浏览器缓存
4. **减少服务器负载**: 减少传输的数据量

## Nginx 配置示例

### 基础 Gzip 配置

```nginx
# 在 http 块中添加
http {
    # 启用 gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;  # 最小压缩大小
    gzip_proxied any;
    gzip_comp_level 6;     # 压缩级别 (1-9)

    # 压缩的文件类型
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json
        image/jpeg
        image/png
        image/gif
        image/webp
        model/gltf-binary    # GLB文件MIME类型
        application/octet-stream;  # 通用二进制文件
}
```

### 完整的服务器配置

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/your/blog/docs;
    index index.html;

    # Gzip 压缩配置
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json
        image/jpeg
        image/png
        image/gif
        image/webp
        model/gltf-binary
        application/octet-stream;

    # 纹理文件缓存和压缩
    location ~* \.(jpg|jpeg|png|gif|webp)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header X-Content-Type-Options nosniff;

        # 确保纹理文件被压缩
        gzip_static on;
    }

    # GLB模型文件缓存和压缩
    location ~* \.glb$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header X-Content-Type-Options nosniff;
        add_header Content-Type "model/gltf-binary";

        # 确保GLB文件被压缩
        gzip_static on;
    }

    # JavaScript 和 CSS 文件
    location ~* \.(css|js)$ {
        expires 1M;
        add_header Cache-Control "public";
    }

    # HTML 文件不缓存
    location ~* \.html$ {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires 0;
    }

    # 安全头
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";

    # SPA 路由处理
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 验证 Gzip 是否生效

### 1. 使用 curl 测试

```bash
# 测试纹理文件是否被压缩
curl -H "Accept-Encoding: gzip" -I https://your-domain.com/textures/Albedo.jpg

# 测试GLB文件是否被压缩
curl -H "Accept-Encoding: gzip" -I https://your-domain.com/models/satellite.glb

# 应该看到类似输出：
# Content-Encoding: gzip
# Content-Length: [压缩后的大小]
```

### 2. 浏览器开发者工具

1. 打开开发者工具 → Network
2. 刷新页面
3. 查看纹理文件和 GLB 文件的响应头
4. 应该看到 `Content-Encoding: gzip`

### 3. 在线工具测试

- https://www.whatsmyip.org/http-compression-test/
- https://www.giftofspeed.com/gzip-test/

## GLB 文件压缩效果

### 预期压缩率

| 文件类型           | 原始大小 | 压缩后大小 | 压缩率 |
| ------------------ | -------- | ---------- | ------ |
| satellite.glb      | ~2MB     | ~1.2MB     | ~40%   |
| 0.75m.glb          | ~1.5MB   | ~0.9MB     | ~40%   |
| base_satellite.glb | ~1MB     | ~0.6MB     | ~40%   |

### 压缩效果分析

1. **几何体数据**: 顶点、法线、UV 坐标等重复数据
2. **材质数据**: 纹理引用、材质属性等结构化数据
3. **动画数据**: 关键帧、插值数据等
4. **场景图**: 节点层次结构、变换矩阵等

## 性能优化建议

### 1. 压缩级别选择

```nginx
# 平衡压缩率和CPU使用
gzip_comp_level 6;  # 推荐值

# 如果需要更高压缩率（但CPU使用更多）
gzip_comp_level 9;
```

### 2. 预压缩静态文件

```nginx
# 启用静态文件预压缩
gzip_static on;

# 这样 Nginx 会优先使用 .gz 文件
# 例如：satellite.glb.gz
```

### 3. 缓存配置

```nginx
# 纹理文件长期缓存
location ~* \.(jpg|jpeg|png|gif|webp)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# GLB模型文件长期缓存
location ~* \.glb$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# JS/CSS 文件中等缓存
location ~* \.(css|js)$ {
    expires 1M;
    add_header Cache-Control "public";
}
```

## 常见问题

### 1. Gzip 不生效

**检查项**:

- 确认 `gzip on;` 已启用
- 检查文件大小是否超过 `gzip_min_length`
- 确认文件类型在 `gzip_types` 中
- 检查 GLB 文件的 MIME 类型是否正确

### 2. 压缩效果不明显

**可能原因**:

- 图片文件已经是压缩格式（如 JPEG）
- 文件太小，压缩效果有限
- 文件内容本身不容易压缩
- GLB 文件已经过优化，压缩空间有限

### 3. 服务器负载过高

**解决方案**:

- 降低 `gzip_comp_level` 到 4-6
- 增加 `gzip_min_length` 到 2048
- 使用 `gzip_static on` 预压缩文件

## 监控和测试

### 1. 压缩效果监控

```bash
# 查看 Nginx 访问日志中的压缩信息
tail -f /var/log/nginx/access.log | grep gzip
```

### 2. 性能测试

```bash
# 测试压缩前后的文件大小
ls -lh /path/to/models/
ls -lh /path/to/models/*.gz
```

### 3. 浏览器测试

1. 打开开发者工具
2. 访问卫星页面
3. 查看 Network 面板
4. 检查纹理文件和 GLB 文件的 `Content-Encoding` 和 `Content-Length`

## 总结

使用 Nginx 配置 Gzip 压缩的优势：

1. ✅ **服务器端处理**: 无需修改应用代码
2. ✅ **自动压缩**: 实时压缩，无需预压缩
3. ✅ **更好的缓存**: 浏览器可以缓存压缩文件
4. ✅ **减少带宽**: 显著减少传输数据量
5. ✅ **提高加载速度**: 特别是对于大文件（如纹理和 GLB 模型）

对于你的卫星页面，这应该能显著改善纹理文件和 GLB 模型的加载速度！
