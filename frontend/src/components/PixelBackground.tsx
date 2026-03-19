import React from 'react';

interface PixelBackgroundProps {
  variant?: 'light' | 'dark' | 'growth' | 'celebration';
  children: React.ReactNode;
}

export default function PixelBackground({ variant = 'light', children }: PixelBackgroundProps) {
  const bgColors = {
    light: 'bg-[#fafafa]',
    dark: 'bg-[#18181b]',
    growth: 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50',
    celebration: 'bg-gradient-to-r from-blue-50 to-green-50'
  };

  return (
    <div className={`min-h-screen ${bgColors[variant]} relative overflow-hidden`}>
      {/* 像素装饰 - 左上角 */}
      <div className="absolute top-4 left-4 flex gap-1 opacity-30">
        <div className="w-2 h-2 bg-gray-400"></div>
        <div className="w-2 h-2 bg-gray-300"></div>
        <div className="w-2 h-2 bg-gray-400"></div>
      </div>

      {/* 像素装饰 - 右上角 */}
      <div className="absolute top-4 right-4 flex gap-1 opacity-30">
        <div className="w-2 h-2 bg-gray-400"></div>
        <div className="w-2 h-2 bg-gray-300"></div>
        <div className="w-2 h-2 bg-gray-400"></div>
      </div>

      {/* 像素装饰 - 左下角 */}
      <div className="absolute bottom-4 left-4 flex gap-1 opacity-20">
        <div className="w-1.5 h-1.5 bg-gray-400"></div>
        <div className="w-1.5 h-1.5 bg-gray-300"></div>
        <div className="w-1.5 h-1.5 bg-gray-400"></div>
        <div className="w-1.5 h-1.5 bg-gray-300"></div>
      </div>

      {/* 像素装饰 - 右下角 */}
      <div className="absolute bottom-4 right-4 flex gap-1 opacity-20">
        <div className="w-1.5 h-1.5 bg-gray-400"></div>
        <div className="w-1.5 h-1.5 bg-gray-300"></div>
        <div className="w-1.5 h-1.5 bg-gray-400"></div>
        <div className="w-1.5 h-1.5 bg-gray-300"></div>
      </div>

      {/* 中心内容 */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

// 纯装饰性像素点背景组件
export function PixelPatternBg({
  color = '#e5e7eb',
  density = 'normal'
}: {
  color?: string;
  density?: 'sparse' | 'normal' | 'dense';
}) {
  const dotCount = {
    sparse: 8,
    normal: 16,
    dense: 32
  };

  const dots = Array.from({ length: dotCount[density] }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() > 0.5 ? 2 : 3,
    opacity: Math.random() * 0.3 + 0.1
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {dots.map((dot) => (
        <div
          key={dot.id}
          className="absolute rounded-sm"
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            width: dot.size,
            height: dot.size,
            backgroundColor: color,
            opacity: dot.opacity
          }}
        />
      ))}
    </div>
  );
}

// 渐变像素背景组件
export function GradientPixelBg({
  from = '#eff6ff',
  to = '#f3e8ff',
  children
}: {
  from?: string;
  to?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen relative"
      style={{
        background: `linear-gradient(135deg, ${from}, ${to})`
      }}
    >
      <PixelPatternBg density="sparse" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
