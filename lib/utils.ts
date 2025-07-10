import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 获取静态资源路径，自动添加 basePath
export function getAssetPath(path: string): string {
  // 确保路径以 / 开头
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  // 在客户端环境下，从 window.__NEXT_DATA__ 获取 basePath
  if (typeof window !== 'undefined') {
    const basePath = window.__NEXT_DATA__?.buildId ?
      (window as any).__NEXT_DATA__?.assetPrefix || '' : '';
    return `${basePath}${normalizedPath}`;
  }

  // 服务端或构建时，返回原路径（Next.js 会自动处理）
  return normalizedPath;
} 