import { getImagePath, preloadImages } from './imageUtils.ts'

// Track what's already been preloaded
const preloaded = new Set<string>()

function preloadOnce(paths: readonly string[]): void {
  const newPaths = paths
    .map(getImagePath)
    .filter((p) => !preloaded.has(p))

  if (newPaths.length === 0) return

  for (const p of newPaths) {
    preloaded.add(p)
  }

  preloadImages(newPaths).catch(() => {
    // silently ignore preload failures
  })
}

// Claw sprite paths for a given stage
const STAGE_NAMES = ['婴儿', '儿童', '青少年', '商务'] as const
const ACTIONS = ['待机', '正面走', '奔跑'] as const

function getClawStageIndex(round: number): number {
  if (round < 3) return 0
  if (round < 6) return 1
  if (round < 8) return 2
  return 3
}

function getClawSpritePaths(stageIndex: number): string[] {
  const stage = STAGE_NAMES[stageIndex]
  const paths: string[] = []
  for (const action of ACTIONS) {
    paths.push(`/images/claw/${stage}${action}1.png`)
    paths.push(`/images/claw/${stage}${action}2.png`)
  }
  return paths
}

// Round backgrounds
const ROUND_BACKGROUNDS = [
  '/images/背景/学校和街区背景_1.png',
  '/images/背景/学校和街区背景_2.png',
  '/images/背景/图书馆场景_1.png',
  '/images/背景/虚拟工作空间_1.png',
  '/images/背景/虚拟工作空间_2.png',
  '/images/背景/社交活动场景_1.png',
  '/images/背景/电商场景_1.png',
  '/images/背景/社交活动场景_3.png',
  '/images/背景/深色反思背景1.png',
  '/images/背景/暖色深思背景1.png',
] as const

const ENDING_BACKGROUNDS = [
  '/images/结局/科含结局背景.png',
  '/images/结局/作家结局背景.png',
  '/images/结局/赚钱机器结局_4.png',
  '/images/结局/自由自在结局背景.png',
  '/images/结局/迷茫打工人结局_1.png',
] as const

/**
 * Preload assets for the start page (call on app mount)
 */
export function preloadStartPageAssets(): void {
  preloadOnce([
    '/images/背景/欢迎屏幕背景_2.png',
    ...getClawSpritePaths(0), // baby sprites
  ])
}

/**
 * Preload assets for the current and next game round
 */
export function preloadGameRoundAssets(currentRound: number): void {
  // Current round
  const currentBg = ROUND_BACKGROUNDS[currentRound]
  const currentStage = getClawStageIndex(currentRound)
  const currentPaths = [
    ...(currentBg ? [currentBg] : []),
    ...getClawSpritePaths(currentStage),
  ]
  preloadOnce(currentPaths)

  // Next round (look-ahead)
  const nextRound = currentRound + 1
  if (nextRound < ROUND_BACKGROUNDS.length) {
    const nextBg = ROUND_BACKGROUNDS[nextRound]
    const nextStage = getClawStageIndex(nextRound)
    const nextPaths = [
      ...(nextBg ? [nextBg] : []),
      ...getClawSpritePaths(nextStage),
    ]
    // Preload next round with slight delay to prioritize current
    setTimeout(() => preloadOnce(nextPaths), 200)
  }
}

/**
 * Preload result page backgrounds (call when game is about to finish)
 */
export function preloadResultAssets(): void {
  preloadOnce([...ENDING_BACKGROUNDS])
}
