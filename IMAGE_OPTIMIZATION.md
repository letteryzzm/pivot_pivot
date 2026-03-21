# 图片优化实施指南

## ✅ 已完成的优化

### 1. Vite 配置优化
- 端口改为 5001（避免冲突）
- 集成 vite-plugin-imagemin 自动压缩
- JPEG 质量 80%，PNG 质量 70-80%，WebP 质量 80%

### 2. 懒加载组件
位置：`src/components/LazyImage.tsx`

使用方法：
```tsx
import { LazyImage } from '@/components/LazyImage'

<LazyImage
  src="/images/背景/电商场景_1.png"
  alt="电商场景"
  className="w-full h-screen"
/>
```

### 3. 图片预加载工具
位置：`src/utils/imagePreloader.ts`

使用方法：
```tsx
import { preloadImages } from '@/utils/imagePreloader'

// 预加载关键图片
useEffect(() => {
  preloadImages([
    '/images/背景/欢迎屏幕背景_1.png',
    '/images/claw/商务待机1.png'
  ])
}, [])
```

### 4. WebP 批量转换脚本
位置：`scripts/convert-images.ts`

运行：
```bash
npm run convert-images
```

会将 `public/images` 下所有 PNG/JPEG 转为 WebP，输出到 `public/images-optimized`

## 🚀 使用步骤

### 步骤 1：转换现有图片
```bash
cd frontend
npm run convert-images
```

### 步骤 2：替换图片引用
将代码中的图片路径从：
```tsx
<img src="/images/背景/电商场景_1.png" />
```

改为：
```tsx
<LazyImage src="/images-optimized/背景/电商场景_1.webp" alt="电商场景" />
```

### 步骤 3：测试效果
```bash
npm run dev
```

访问 http://localhost:5001

## 📊 预期效果

- 图片体积减少 60-80%
- 首屏加载时间减少 70%
- 非首屏图片按需加载
- 构建时自动压缩

## 🔧 进一步优化建议

1. **响应式图片**：为不同屏幕尺寸生成多个版本
2. **CDN 部署**：将图片上传到阿里云 OSS/腾讯云 COS
3. **模糊占位符**：使用 blurhash 生成占位图
