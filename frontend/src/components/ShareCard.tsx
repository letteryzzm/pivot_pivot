import { useEffect, useRef, useState, useCallback } from 'react'
import type { PlayerStats, GameResult } from '../types/game.ts'
import { getImagePath } from '../utils/imageUtils.ts'

interface ShareCardProps {
  readonly playerName: string
  readonly stats: PlayerStats
  readonly result: GameResult
  readonly rankData: {
    readonly percentile: number
    readonly totalPlayers: number
    readonly beatCount: number
  } | null
  readonly onClose: () => void
}

const SHARE_BACKGROUNDS: readonly string[] = [
  '/images/背景/深色反思背景1.png',
  '/images/背景/深色反思背景2.png',
  '/images/背景/深色反思背景3.png',
  '/images/背景/深色反思背景4.png',
  '/images/背景/深色反思背景5.png',
  '/images/背景/深色反思背景6.png',
  '/images/背景/深色反思背景7.png',
  '/images/背景/深色反思背景8.png',
  '/images/背景/深色反思背景9.png',
  '/images/背景/深色深度思考背景1.png',
  '/images/背景/深色深度思考背景2.png',
  '/images/背景/深色深度思考背景3.png',
  '/images/背景/深色深度思考背景4.png',
]

function pickRandomBackground(): string {
  const index = Math.floor(Math.random() * SHARE_BACKGROUNDS.length)
  return getImagePath(SHARE_BACKGROUNDS[index])
}

const CANVAS_WIDTH = 750
const CANVAS_HEIGHT = 1334
const FONT_FAMILY = '"PingFang SC", "Microsoft YaHei", "Helvetica Neue", sans-serif'

const STAT_COLORS: Record<string, string> = {
  judgment: '#60a5fa',
  action: '#4ade80',
  cognition: '#c084fc',
  connection: '#fbbf24',
}

const STAT_LABELS: Record<string, string> = {
  judgment: '判断力',
  action: '行动力',
  cognition: '认知',
  connection: '连接力',
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function drawBackground(ctx: CanvasRenderingContext2D, bgImage: HTMLImageElement) {
  // Draw the background image, covering the canvas (cover mode)
  const imgRatio = bgImage.width / bgImage.height
  const canvasRatio = CANVAS_WIDTH / CANVAS_HEIGHT

  let sx = 0, sy = 0, sw = bgImage.width, sh = bgImage.height
  if (imgRatio > canvasRatio) {
    // Image is wider — crop sides
    sw = bgImage.height * canvasRatio
    sx = (bgImage.width - sw) / 2
  } else {
    // Image is taller — crop top/bottom
    sh = bgImage.width / canvasRatio
    sy = (bgImage.height - sh) / 2
  }

  ctx.drawImage(bgImage, sx, sy, sw, sh, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  // Dark overlay for text readability
  ctx.fillStyle = 'rgba(0, 0, 0, 0.55)'
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
}

function drawTitle(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)'
  ctx.font = `500 28px ${FONT_FAMILY}`
  ctx.textAlign = 'center'
  ctx.fillText("A Claw's Purpose", CANVAS_WIDTH / 2, 70)
}

function drawPlayerInfo(
  ctx: CanvasRenderingContext2D,
  playerName: string,
  resultTitle: string,
) {
  const centerX = CANVAS_WIDTH / 2

  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
  ctx.font = `400 30px ${FONT_FAMILY}`
  ctx.textAlign = 'center'
  ctx.fillText(playerName, centerX, 150)

  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
  ctx.font = `400 24px ${FONT_FAMILY}`
  ctx.fillText('成长为了', centerX, 195)

  ctx.fillStyle = '#ffffff'
  ctx.font = `bold 52px ${FONT_FAMILY}`
  ctx.fillText(resultTitle, centerX, 270)
}

function drawScoreCards(
  ctx: CanvasRenderingContext2D,
  score: number,
  percentile: number,
) {
  const cardY = 320
  const cardH = 120
  const cardW = 280
  const gap = 40
  const leftX = CANVAS_WIDTH / 2 - cardW - gap / 2
  const rightX = CANVAS_WIDTH / 2 + gap / 2

  // Left card - score
  ctx.fillStyle = 'rgba(255, 255, 255, 0.06)'
  drawRoundedRect(ctx, leftX, cardY, cardW, cardH, 16)
  ctx.fill()
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
  ctx.lineWidth = 1
  ctx.stroke()

  ctx.fillStyle = '#ffffff'
  ctx.font = `bold 48px ${FONT_FAMILY}`
  ctx.textAlign = 'center'
  ctx.fillText(String(score), leftX + cardW / 2, cardY + 60)

  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
  ctx.font = `400 20px ${FONT_FAMILY}`
  ctx.fillText('创业者指数', leftX + cardW / 2, cardY + 95)

  // Right card - percentile
  ctx.fillStyle = 'rgba(255, 255, 255, 0.06)'
  drawRoundedRect(ctx, rightX, cardY, cardW, cardH, 16)
  ctx.fill()
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
  ctx.lineWidth = 1
  ctx.stroke()

  ctx.fillStyle = '#ffffff'
  ctx.font = `bold 48px ${FONT_FAMILY}`
  ctx.fillText(`${percentile}%`, rightX + cardW / 2, cardY + 60)

  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
  ctx.font = `400 20px ${FONT_FAMILY}`
  ctx.fillText('超越玩家', rightX + cardW / 2, cardY + 95)
}

function drawStatBars(ctx: CanvasRenderingContext2D, stats: PlayerStats) {
  const startY = 510
  const barHeight = 20
  const barMaxWidth = 380
  const labelWidth = 90
  const leftMargin = 80
  const lineSpacing = 60

  const entries: ReadonlyArray<[string, number]> = [
    ['judgment', stats.judgment],
    ['action', stats.action],
    ['cognition', stats.cognition],
    ['connection', stats.connection],
  ]

  entries.forEach(([key, value], i) => {
    const y = startY + i * lineSpacing

    // Label
    ctx.fillStyle = STAT_COLORS[key]
    ctx.font = `500 26px ${FONT_FAMILY}`
    ctx.textAlign = 'left'
    ctx.fillText(STAT_LABELS[key], leftMargin, y + 16)

    // Background bar
    const barX = leftMargin + labelWidth + 20
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)'
    drawRoundedRect(ctx, barX, y, barMaxWidth, barHeight, 10)
    ctx.fill()

    // Filled bar
    const filledWidth = Math.max(8, (value / 100) * barMaxWidth)
    ctx.fillStyle = STAT_COLORS[key]
    drawRoundedRect(ctx, barX, y, filledWidth, barHeight, 10)
    ctx.fill()

    // Value
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
    ctx.font = `500 24px ${FONT_FAMILY}`
    ctx.textAlign = 'right'
    ctx.fillText(String(value), CANVAS_WIDTH - 80, y + 16)
  })
}

function drawQuote(ctx: CanvasRenderingContext2D) {
  const y = 790

  ctx.fillStyle = 'rgba(255, 255, 255, 0.06)'
  drawRoundedRect(ctx, 60, y - 30, CANVAS_WIDTH - 120, 80, 12)
  ctx.fill()
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
  ctx.lineWidth = 1
  ctx.stroke()

  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
  ctx.font = `italic 22px ${FONT_FAMILY}`
  ctx.textAlign = 'center'
  ctx.fillText('"创业最宝贵的不是赚钱机会，', CANVAS_WIDTH / 2, y + 2)
  ctx.fillText('而是成长密度"', CANVAS_WIDTH / 2, y + 32)
}

function drawQRCode(
  ctx: CanvasRenderingContext2D,
  qrImage: HTMLImageElement,
) {
  const qrSize = 160
  const qrX = (CANVAS_WIDTH - qrSize) / 2
  const qrY = 920

  // White background behind QR
  ctx.fillStyle = '#ffffff'
  drawRoundedRect(ctx, qrX - 12, qrY - 12, qrSize + 24, qrSize + 24, 12)
  ctx.fill()

  ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize)

  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)'
  ctx.font = `400 22px ${FONT_FAMILY}`
  ctx.textAlign = 'center'
  ctx.fillText('扫码测测你的创业者基因', CANVAS_WIDTH / 2, qrY + qrSize + 50)
}

function drawDecorations(ctx: CanvasRenderingContext2D) {
  // Top and bottom subtle lines
  const lineGrad = ctx.createLinearGradient(100, 0, CANVAS_WIDTH - 100, 0)
  lineGrad.addColorStop(0, 'rgba(255, 255, 255, 0)')
  lineGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)')
  lineGrad.addColorStop(1, 'rgba(255, 255, 255, 0)')

  ctx.strokeStyle = lineGrad
  ctx.lineWidth = 1

  ctx.beginPath()
  ctx.moveTo(100, 100)
  ctx.lineTo(CANVAS_WIDTH - 100, 100)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(100, 870)
  ctx.lineTo(CANVAS_WIDTH - 100, 870)
  ctx.stroke()
}

function renderCanvas(
  canvas: HTMLCanvasElement,
  playerName: string,
  stats: PlayerStats,
  result: GameResult,
  percentile: number,
  qrImage: HTMLImageElement,
  bgImage: HTMLImageElement,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  canvas.width = CANVAS_WIDTH
  canvas.height = CANVAS_HEIGHT

  drawBackground(ctx, bgImage)
  drawDecorations(ctx)
  drawTitle(ctx)
  drawPlayerInfo(ctx, playerName, result.title)
  drawScoreCards(ctx, result.score, percentile)
  drawStatBars(ctx, stats)
  drawQuote(ctx)
  drawQRCode(ctx, qrImage)
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

export default function ShareCard({
  playerName,
  stats,
  result,
  rankData,
  onClose,
}: ShareCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isReady, setIsReady] = useState(false)
  const [statusText, setStatusText] = useState('')

  const displayPercentile = rankData?.percentile ?? result.percentile

  const bgPathRef = useRef(pickRandomBackground())

  useEffect(() => {
    const init = async () => {
      const canvas = canvasRef.current
      if (!canvas) return

      try {
        const [qrImage, bgImage] = await Promise.all([
          loadImage('/QRcode.png'),
          loadImage(bgPathRef.current),
          document.fonts?.ready ?? Promise.resolve(),
        ])

        renderCanvas(canvas, playerName, stats, result, displayPercentile, qrImage, bgImage)
        setIsReady(true)
      } catch {
        setStatusText('图片加载失败，请重试')
      }
    }

    init()
  }, [playerName, stats, result, displayPercentile])

  const getCanvasBlob = useCallback((): Promise<Blob | null> => {
    const canvas = canvasRef.current
    if (!canvas) return Promise.resolve(null)

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/png')
    })
  }, [])

  const handleDownload = useCallback(async () => {
    const blob = await getCanvasBlob()
    if (!blob) return

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `aclaws-purpose-${playerName}.png`
    link.click()
    URL.revokeObjectURL(url)

    setStatusText('已保存')
    setTimeout(() => setStatusText(''), 2000)
  }, [getCanvasBlob, playerName])

  const handleShare = useCallback(async () => {
    const blob = await getCanvasBlob()
    if (!blob) return

    const file = new File([blob], `aclaws-purpose-${playerName}.png`, {
      type: 'image/png',
    })

    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({
          title: "A Claw's Purpose",
          files: [file],
        })
        return
      } catch {
        // User cancelled or share failed, fall through to download
      }
    }

    // Fallback to download
    await handleDownload()
  }, [getCanvasBlob, playerName, handleDownload])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex flex-col items-center gap-4 max-h-[95vh] overflow-y-auto px-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="self-end text-white/50 hover:text-white/80 transition-colors text-2xl leading-none p-2"
          aria-label="关闭"
        >
          ✕
        </button>

        {/* Canvas preview */}
        <canvas
          ref={canvasRef}
          className="rounded-xl shadow-2xl"
          style={{
            width: CANVAS_WIDTH / 2,
            height: CANVAS_HEIGHT / 2,
            opacity: isReady ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />

        {!isReady && !statusText && (
          <p className="text-white/40 text-sm">正在生成分享卡...</p>
        )}

        {/* Action buttons */}
        {isReady && (
          <div className="flex gap-3 w-full max-w-[375px]">
            <button
              onClick={handleDownload}
              className="flex-1 py-3 text-sm font-medium rounded-xl bg-white/15 border border-white/20 hover:bg-white/25 active:scale-[0.98] transition-all text-white"
            >
              保存图片
            </button>
            <button
              onClick={handleShare}
              className="flex-1 py-3 text-sm font-medium rounded-xl bg-indigo-500/80 border border-indigo-400/30 hover:bg-indigo-500/90 active:scale-[0.98] transition-all text-white"
            >
              分享给朋友
            </button>
          </div>
        )}

        {statusText && (
          <p className="text-white/60 text-sm">{statusText}</p>
        )}
      </div>
    </div>
  )
}
