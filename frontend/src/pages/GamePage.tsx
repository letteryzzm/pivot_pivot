import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../store/gameStore.ts'
import { TOTAL_ROUNDS } from '../game/scenarios.ts'
import type { Choice } from '../types/game.ts'
import ClawSprite, { getClawStage } from '../components/ClawSprite.tsx'
import TypewriterText from '../components/TypewriterText.tsx'
import { motion, AnimatePresence } from 'framer-motion'
import { getImagePath } from '../utils/imageUtils.ts'
import { preloadGameRoundAssets, preloadResultAssets } from '../utils/imagePreloader.ts'

function t(text: string, name: string): string {
  return text.replace(/\{name\}/g, name)
}

const STAT_LABELS: Record<string, { label: string; color: string; bar: string }> = {
  judgment: { label: '判断力', color: 'text-blue-300', bar: 'bg-blue-400' },
  action: { label: '行动力', color: 'text-green-300', bar: 'bg-green-400' },
  cognition: { label: '认知', color: 'text-purple-300', bar: 'bg-purple-400' },
  connection: { label: '连接力', color: 'text-amber-300', bar: 'bg-amber-400' },
}

// Pick a scene-appropriate background based on round
const ROUND_BACKGROUNDS = [
  '/images/背景/深色反思背景1.png',
  '/images/背景/暖色深思背景1.png',
  '/images/背景/深色反思背景1.png',
  '/images/背景/暖色深思背景1.png',
  '/images/背景/深色反思背景1.png',
  '/images/背景/暖色深思背景1.png',
  '/images/背景/深色反思背景1.png',
  '/images/背景/暖色深思背景1.png',
  '/images/背景/深色反思背景1.png',
  '/images/背景/暖色深思背景1.png',
]

export default function GamePage() {
  const navigate = useNavigate()
  const {
    currentRound, stats, isPlaying, isFinished, makeChoice, playerName, scenarios, bridge,
  } = useGameStore()

  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null)
  const [phase, setPhase] = useState<'choose' | 'reaction'>('choose')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const roundStartTimeRef = useRef<number>(0)
  const currentThinkTimeRef = useRef<number>(0)

  useEffect(() => {
    if (!isPlaying) navigate('/', { replace: true })
  }, [isPlaying, navigate])

  useEffect(() => {
    if (isFinished) navigate('/result', { replace: true })
  }, [isFinished, navigate])

  // Reset round start time when a new round begins
  useEffect(() => {
    roundStartTimeRef.current = Date.now()
  }, [currentRound])

  // Preload current + next round assets; preload result assets near end
  useEffect(() => {
    preloadGameRoundAssets(currentRound)
    if (currentRound >= TOTAL_ROUNDS - 2) {
      preloadResultAssets()
    }
  }, [currentRound])

  const handleChoiceSelect = useCallback((choice: Choice) => {
    if (isTransitioning) return
    currentThinkTimeRef.current = Math.round(
      (Date.now() - roundStartTimeRef.current) / 1000
    )
    setSelectedChoice(choice)
    setPhase('reaction')
  }, [isTransitioning])

  const handleContinue = useCallback(() => {
    if (!selectedChoice || isTransitioning) return
    setIsTransitioning(true)

    setTimeout(() => {
      makeChoice(selectedChoice, currentThinkTimeRef.current)
      setSelectedChoice(null)
      setPhase('choose')
      setIsTransitioning(false)
      currentThinkTimeRef.current = 0
    }, 400)
  }, [selectedChoice, isTransitioning, makeChoice])

  if (!isPlaying || currentRound >= TOTAL_ROUNDS || scenarios.length === 0) return null

  const scenario = scenarios[currentRound]
  const clawStage = getClawStage(currentRound)
  const bgImage = getImagePath(ROUND_BACKGROUNDS[currentRound] || ROUND_BACKGROUNDS[0])

  const progress = ((currentRound + 1) / TOTAL_ROUNDS) * 100

  return (
    <div
      className="min-h-full flex flex-col text-white bg-cover bg-center"
      style={{ backgroundImage: `url('${bgImage}')` }}
    >
      <div className="flex flex-col bg-black/55 backdrop-blur-[2px]" style={{ minHeight: '874px' }}>
        {/* Top bar: progress + stats */}
        <div className="px-4 pt-3 pb-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-white/50">{playerName}</span>
            <span className="text-xs text-white/50 font-mono">
              {currentRound + 1}/{TOTAL_ROUNDS}
            </span>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden mb-3">
            <motion.div
              className="h-full bg-white/60 rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(stats).map(([key, value]) => {
              const cfg = STAT_LABELS[key]
              return (
                <div key={key} className="flex flex-col items-center gap-1">
                  <span className={`text-[9px] ${cfg.color}`}>{cfg.label}</span>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${cfg.bar}`}
                      animate={{ width: `${value}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <span className="text-[9px] text-white/40 font-mono">{value}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col px-4 pb-4">
          <AnimatePresence mode="wait">
            {phase === 'choose' ? (
              <motion.div
                key={`scenario-${scenario.id}`}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col"
              >
                {/* Bridge from previous round */}
                {bridge && currentRound > 0 && (
                  <div className="mt-3 mb-2 px-3 py-2 bg-white/5 rounded-lg border-l-2 border-white/20">
                    <p className="text-xs text-white/50 leading-relaxed italic">
                      {bridge}
                    </p>
                  </div>
                )}

                {/* Claw */}
                <div className="flex justify-center mt-3 mb-2">
                  <ClawSprite stage={clawStage} mood="idle" size={72} />
                </div>

                {/* Scenario description */}
                <div className="mb-4">
                  <span className="text-xs font-mono text-white/40 block mb-1">
                    DAY {scenario.id} · {scenario.title}
                  </span>
                  <p className="text-sm text-white/85 leading-relaxed">
                    {t(scenario.description, playerName)}
                  </p>
                </div>

                {/* Choices */}
                <div className="flex flex-col gap-2.5 mb-4">
                  {scenario.choices.map((choice, index) => {
                    const letter = String.fromCharCode(65 + index)
                    return (
                      <motion.button
                        key={choice.id}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleChoiceSelect(choice)}
                        className="w-full text-left px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-sm"
                      >
                        <div className="flex gap-3">
                          <span className="text-xs font-mono text-white/30 mt-0.5">
                            {letter}
                          </span>
                          <span className="text-sm text-white/80 leading-relaxed">
                            {choice.text}
                          </span>
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={`reaction-${scenario.id}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col items-center justify-center gap-6"
              >
                {/* Claw reacting */}
                <ClawSprite
                  stage={clawStage}
                  mood="idle"
                  size={120}
                />

                {/* Reaction bubble */}
                <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-5 py-4 max-w-[320px]">
                  <TypewriterText
                    text={t(selectedChoice?.clawReaction || '', playerName)}
                    speed={40}
                    className="text-sm text-white/85 leading-relaxed block text-center"
                    showCursor={false}
                  />
                </div>

                {/* Stat effects */}
                {selectedChoice && (
                  <div className="flex flex-wrap gap-2 justify-center">
                    {Object.entries(selectedChoice.effects).map(([key, value]) => {
                      if (!value) return null
                      const cfg = STAT_LABELS[key]
                      const sign = (value as number) > 0 ? '+' : ''
                      return (
                        <span
                          key={key}
                          className={`text-xs px-2 py-1 rounded-lg bg-white/10 ${cfg.color}`}
                        >
                          {cfg.label} {sign}{value as number}
                        </span>
                      )
                    })}
                  </div>
                )}

                {/* Continue button */}
                <button
                  onClick={handleContinue}
                  className="w-full max-w-[280px] py-3 text-sm font-medium rounded-xl bg-white/15 border border-white/20 hover:bg-white/25 active:scale-[0.98] transition-all"
                >
                  {currentRound < TOTAL_ROUNDS - 1 ? '继续' : '查看结果'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
