// 反思页面背景图片配置

// 第一阶段（round <= 4）- 反思对话类
export const reflectionDialogImages = [
  { id: 1, path: '/images/背景/暖色反思对话背景1.png', name: '反思对话1' },
  { id: 2, path: '/images/背景/暖色反思对话背景2.png', name: '反思对话2' },
  { id: 3, path: '/images/背景/暖色反思对话背景3.png', name: '反思对话3' },
  { id: 4, path: '/images/背景/暖色反思对话背景4.png', name: '反思对话4' },
];

// 第二阶段（round > 4）- 深思考类
export const reflectionDeepImages = [
  { id: 5, path: '/images/背景/暖色深思背景1.png', name: '深思考1' },
  { id: 6, path: '/images/背景/暖色深思背景2.png', name: '深思考2' },
  { id: 7, path: '/images/背景/暖色深思背景3.png', name: '深思考3' },
  { id: 8, path: '/images/背景/暖色深思背景4.png', name: '深思考4' },
  { id: 9, path: '/images/背景/暖色深思背景5.png', name: '深思考5' },
  { id: 10, path: '/images/背景/暖色深思背景6.png', name: '深思考6' },
  { id: 11, path: '/images/背景/暖色深思背景7.png', name: '深思考7' },
  { id: 12, path: '/images/背景/暖色深思背景8.png', name: '深思考8' },
];

// 根据round获取对应阶段的图片列表
export function getReflectionImagesByRound(round: number) {
  return round <= 4 ? reflectionDialogImages : reflectionDeepImages;
}

// 根据ID获取图片路径
export function getImagePathById(imageId: number): string {
  const allImages = [...reflectionDialogImages, ...reflectionDeepImages];
  const image = allImages.find(img => img.id === imageId);
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
