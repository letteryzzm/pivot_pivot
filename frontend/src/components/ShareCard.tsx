import { useEffect, useRef, useState, useCallback } from 'react'
import type { PlayerStats, GameResult } from '../types/game.ts'

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

function drawBackground(ctx: CanvasRenderingContext2D) {
  const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT)
  gradient.addColorStop(0, '#0f0f1a')
  gradient.addColorStop(0.3, '#1a1a2e')
  gradient.addColorStop(0.7, '#16213e')
  gradient.addColorStop(1, '#0f0f1a')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  // Subtle radial glow
  const radial = ctx.createRadialGradient(
    CANVAS_WIDTH / 2, 400, 50,
    CANVAS_WIDTH / 2, 400, 400,
  )
  radial.addColorStop(0, 'rgba(99, 102, 241, 0.08)')
  radial.addColorStop(1, 'rgba(99, 102, 241, 0)')
  ctx.fillStyle = radial
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
  isHidden: boolean,
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

  // Hidden ending badge
  if (isHidden) {
    const badgeText = '隐藏结局'
    ctx.font = `500 22px ${FONT_FAMILY}`
    const textWidth = ctx.measureText(badgeText).width
    const badgeW = textWidth + 32
    const badgeH = 36
    const badgeX = centerX - badgeW / 2
    const badgeY = 285

    ctx.fillStyle = 'rgba(245, 158, 11, 0.2)'
    drawRoundedRect(ctx, badgeX, badgeY, badgeW, badgeH, 18)
    ctx.fill()
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.3)'
    ctx.lineWidth = 1
    ctx.stroke()

    ctx.fillStyle = '#fbbf24'
    ctx.font = `500 22px ${FONT_FAMILY}`
    ctx.textAlign = 'center'
    ctx.fillText(badgeText, centerX, badgeY + 25)
  }
}

function drawScoreCards(
  ctx: CanvasRenderingContext2D,
  score: number,
  percentile: number,
  isHidden: boolean,
) {
  const cardY = isHidden ? 345 : 320
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

function drawStatBars(ctx: CanvasRenderingContext2D, stats: PlayerStats, isHidden: boolean) {
  const startY = isHidden ? 535 : 510
  const barHeight = 20
  const barMaxWidth = 380
  const labelWidth = 90
  const leftMargin = 80
  const lineSpacing = 55

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

function drawFingerprints(
  ctx: CanvasRenderingContext2D,
  fingerprints: readonly string[],
  isHidden: boolean,
) {
  if (fingerprints.length === 0) return

  const startY = isHidden ? 780 : 755
  const leftMargin = 80

  // Section title
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)'
  ctx.font = `400 22px ${FONT_FAMILY}`
  ctx.textAlign = 'left'
  ctx.fillText('决策指纹', leftMargin, startY)

  // Fingerprint items
  fingerprints.forEach((fp, i) => {
    const y = startY + 35 + i * 36

    // Number
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)'
    ctx.font = `400 20px ${FONT_FAMILY}`
    ctx.textAlign = 'left'
    ctx.fillText(String(i + 1).padStart(2, '0'), leftMargin, y)

    // Text
    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)'
    ctx.font = `400 22px ${FONT_FAMILY}`
    ctx.fillText(fp, leftMargin + 40, y)
  })
}

function drawQuote(ctx: CanvasRenderingContext2D, isHidden: boolean) {
  const y = isHidden ? 920 : 895

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
  isHidden: boolean,
) {
  const qrSize = 160
  const qrX = (CANVAS_WIDTH - qrSize) / 2
  const qrY = isHidden ? 1030 : 1010

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
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  canvas.width = CANVAS_WIDTH
  canvas.height = CANVAS_HEIGHT

  const isHidden = result.isHidden

  drawBackground(ctx)
  drawDecorations(ctx)
  drawTitle(ctx)
  drawPlayerInfo(ctx, playerName, result.title, isHidden)
  drawScoreCards(ctx, result.score, percentile, isHidden)
  drawStatBars(ctx, stats, isHidden)
  drawFingerprints(ctx, result.fingerprints, isHidden)
  drawQuote(ctx, isHidden)
  drawQRCode(ctx, qrImage, isHidden)
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

  useEffect(() => {
    const init = async () => {
      const canvas = canvasRef.current
      if (!canvas) return

      try {
        const [qrImage] = await Promise.all([
          loadImage('/QRcode.png'),
          document.fonts?.ready ?? Promise.resolve(),
        ])

        renderCanvas(canvas, playerName, stats, result, displayPercentile, qrImage)
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
