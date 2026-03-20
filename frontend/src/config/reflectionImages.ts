// 反思页面背景图片配置 (共19个)

// 反思对话类 (1-10)
export const reflectionDialogImages = [
  { id: 1, path: '/images/背景/暖色反思对话背景1.png', name: '暖色反思对话1' },
  { id: 2, path: '/images/背景/暖色反思对话背景2.png', name: '暖色反思对话2' },
  { id: 3, path: '/images/背景/暖色反思对话背景3.png', name: '暖色反思对话3' },
  { id: 4, path: '/images/背景/暖色反思对话背景4.png', name: '暖色反思对话4' },
  { id: 5, path: '/images/背景/浅色反思对话背景_4.png', name: '浅色反思对话1' },
  { id: 6, path: '/images/背景/浅色深思对话背景1.png', name: '浅色深思对话1' },
  { id: 7, path: '/images/背景/浅色深思对话背景2.png', name: '浅色深思对话2' },
  { id: 8, path: '/images/背景/浅色深思对话背景3.png', name: '浅色深思对话3' },
  { id: 9, path: '/images/背景/深色反思背景1.png', name: '深色反思1' },
  { id: 10, path: '/images/背景/深色反思背景2.png', name: '深色反思2' },
];

// 深思考类 (11-19)
export const reflectionDeepImages = [
  { id: 11, path: '/images/背景/暖色深思背景1.png', name: '暖色深思1' },
  { id: 12, path: '/images/背景/暖色深思背景2.png', name: '暖色深思2' },
  { id: 13, path: '/images/背景/暖色深思背景3.png', name: '暖色深思3' },
  { id: 14, path: '/images/背景/暖色深思背景4.png', name: '暖色深思4' },
  { id: 15, path: '/images/背景/暖色深思背景5.png', name: '暖色深思5' },
  { id: 16, path: '/images/背景/暖色深思背景6.png', name: '暖色深思6' },
  { id: 17, path: '/images/背景/暖色深思背景7.png', name: '暖色深思7' },
  { id: 18, path: '/images/背景/暖色深思背景8.png', name: '暖色深思8' },
  { id: 19, path: '/images/背景/深色深思背景1.png', name: '深色深思1' },
];

// 所有图片
export const allReflectionImages = [...reflectionDialogImages, ...reflectionDeepImages];

// 根据round获取对应阶段的图片列表
export function getReflectionImagesByRound(round: number) {
  return round <= 4 ? reflectionDialogImages : reflectionDeepImages;
}

// 根据ID获取图片路径
export function getImagePathById(imageId: number): string {
  const image = allReflectionImages.find(img => img.id === imageId);
  return image?.path || reflectionDialogImages[0].path;
}

// 别名
export const getReflectionImagePathById = getImagePathById;

// 随机获取一张图片（用于降级）
export function getRandomReflectionImage(round: number): string {
  const images = getReflectionImagesByRound(round);
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex].path;
}
