import { useState, useEffect } from 'react'

type ClawStage = 'baby' | 'child' | 'teen' | 'business'

const STAGE_MAP: Record<ClawStage, string> = {
  baby: '婴儿',
  child: '儿童',
  teen: '青少年',
  business: '商务',
}

interface ClawSpriteProps {
  stage: ClawStage
  mood?: 'idle' | 'walk' | 'run'
  size?: number
  className?: string
}

export function getClawStage(round: number): ClawStage {
  if (round < 3) return 'baby'
  if (round < 6) return 'child'
  if (round < 8) return 'teen'
  return 'business'
}

export default function ClawSprite({
  stage,
  mood = 'idle',
  size = 96,
  className = '',
}: ClawSpriteProps) {
  const [frame, setFrame] = useState(1)

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((f) => (f === 1 ? 2 : 1))
    }, 500)
    return () => clearInterval(interval)
  }, [])

  const prefix = STAGE_MAP[stage]
  const actionMap: Record<string, string> = {
    idle: '待机',
    walk: '正面走',
    run: '奔跑',
  }
  const action = actionMap[mood] || '待机'
  const src = `/images/claw/${prefix}${action}${frame}.png`

  return (
    <img
      src={src}
      alt="Claw"
      width={size}
      height={size}
      className={`image-rendering-pixelated ${className}`}
      style={{ imageRendering: 'pixelated' }}
    />
  )
}
