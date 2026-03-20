// 活动/反馈页面背景图片配置

// 阶段1（童年期）- 学习探索类
export const stage1ActivityImages = [
  { id: 1, path: '/images/背景/学校和街区背景_1.png', name: '学校街区1' },
  { id: 2, path: '/images/背景/学校和街区背景_2.png', name: '学校街区2' },
  { id: 3, path: '/images/背景/学校和街区背景_3.png', name: '学校街区3' },
  { id: 4, path: '/images/背景/学校和街区背景_4.png', name: '学校街区4' },
  { id: 5, path: '/images/背景/图书馆场景_1.png', name: '图书馆1' },
  { id: 6, path: '/images/背景/图书馆场景_2.png', name: '图书馆2' },
  { id: 7, path: '/images/背景/图书馆场景_3.png', name: '图书馆3' },
  { id: 8, path: '/images/背景/图书馆场景_4.png', name: '图书馆4' },
  { id: 13, path: '/images/背景/社交活动场景_1.png', name: '社交活动1' },
  { id: 14, path: '/images/背景/社交活动场景_2.png', name: '社交活动2' },
  { id: 15, path: '/images/背景/社交活动场景_3.png', name: '社交活动3' },
  { id: 16, path: '/images/背景/社交活动场景_4.png', name: '社交活动4' },
];

// 阶段2（成年期）- 工作赚钱类
export const stage2ActivityImages = [
  { id: 9, path: '/images/背景/虚拟工作空间_1.png', name: '工作空间1' },
  { id: 10, path: '/images/背景/虚拟工作空间_2.png', name: '工作空间2' },
  { id: 11, path: '/images/背景/虚拟工作空间_3.png', name: '工作空间3' },
  { id: 12, path: '/images/背景/虚拟工作空间_4.png', name: '工作空间4' },
  { id: 17, path: '/images/背景/电商场景_1.png', name: '电商场景1' },
  { id: 18, path: '/images/背景/电商场景_2.png', name: '电商场景2' },
  { id: 19, path: '/images/背景/电商场景_3.png', name: '电商场景3' },
  { id: 20, path: '/images/背景/电商场景_4.png', name: '电商场景4' },
];

// 根据阶段获取图片列表
export function getActivityImagesByStage(stage: number) {
  return stage === 1 ? stage1ActivityImages : stage2ActivityImages;
}

// 根据ID获取图片路径
export function getActivityImagePathById(imageId: number): string {
  const allImages = [...stage1ActivityImages, ...stage2ActivityImages];
  const image = allImages.find(img => img.id === imageId);
  return image?.path || stage1ActivityImages[0].path;
}

// 随机获取一张图片
export function getRandomActivityImage(stage: number): string {
  const images = getActivityImagesByStage(stage);
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex].path;
}
