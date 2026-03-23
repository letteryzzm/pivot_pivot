import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../store/gameStore.ts'
import type { PlayerPath } from '../types/game.ts'
import ClawSprite from '../components/ClawSprite.tsx'
import { motion, AnimatePresence } from 'framer-motion'
import { getImagePath } from '../utils/imageUtils.ts'
import { preloadStartPageAssets, preloadGameRoundAssets } from '../utils/imagePreloader.ts'

const PATH_OPTIONS: { path: PlayerPath; emoji: string; title: string; desc: string }[] = [
  {
    path: 'exploring',
    emoji: '\u{1F914}',
    title: '还没想好',
    desc: '不确定要不要创业，想先了解自己',
  },
  {
    path: 'ready',
    emoji: '\u{1F525}',
    title: '准备开始',
    desc: '已经决定了，正在寻找方向和方法',
  },
  {
    path: 'started',
    emoji: '\u{1F680}',
    title: '已经在创业',
    desc: '正在路上，面对真实的挑战',
  },
]

export default function StartPage() {
  const [name, setName] = useState('')
  const [step, setStep] = useState<'name' | 'path'>('name')
  const startGame = useGameStore((s) => s.startGame)
  const navigate = useNavigate()

  const handleNameSubmit = () => {
    const trimmed = name.trim()
    if (trimmed.length === 0) return
    setStep('path')
  }

  const handlePathSelect = (path: PlayerPath) => {
    startGame(name.trim(), path)
    navigate('/game')
  }

  useEffect(() => {
    preloadStartPageAssets()
    preloadGameRoundAssets(0)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleNameSubmit()
  }

  const bgUrl = getImagePath('/images/背景/欢迎屏幕背景_2.png')

  return (
    <div
      className="min-h-full flex flex-col text-white bg-cover bg-center"
      style={{ backgroundImage: `url('${bgUrl}')` }}
    >
      <div className="flex flex-col bg-black/50 backdrop-blur-sm" style={{ minHeight: '874px' }}>
        <div className="h-12" />

        <div className="flex-1 flex flex-col px-6">
          {/* Claw character */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center gap-3 mb-4"
          >
            <ClawSprite stage="baby" mood="idle" size={120} />
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex flex-col items-center gap-1 mb-6"
          >
            <h1 className="text-3xl font-bold tracking-tight text-white">
              A Claw's Purpose
            </h1>
            <p className="text-sm text-white/60">
              {step === 'name'
                ? '在 AI 时代，找到你的创业之路'
                : `${name.trim()}，你现在处于哪个阶段？`}
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {step === 'name' ? (
              <motion.div
                key="name-step"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="flex-1 flex flex-col"
              >
                {/* Quote */}
                <div className="mb-6 px-2">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <p className="text-sm text-white/80 leading-relaxed">
                      "这一代人如果不在AI时代做一次创业尝试，可能注定终身为其他人的公司或Agent打工。"
                    </p>
                    <p className="text-xs text-white/40 mt-2">— Roderick</p>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6 px-1">
                  <p className="text-sm text-white/60 leading-relaxed text-center">
                    给你的 Claw 取个名字，陪它经历 10 个创业抉择。
                    <br />
                    你的每一个选择，都在塑造它的创业者基因。
                  </p>
                </div>

                {/* Input */}
                <div className="flex flex-col gap-4 mt-auto mb-8">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-white/40 px-1">
                      给你的 Claw 起个名字
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onKeyDown={handleKeyDown}
                      maxLength={20}
                      className="w-full h-12 px-4 bg-white/10 border border-white/20 rounded-xl text-base text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all"
                      placeholder="它叫什么？"
                      autoFocus
                    />
                  </div>

                  <button
                    onClick={handleNameSubmit}
                    disabled={name.trim().length === 0}
                    className="w-full py-3.5 text-base font-medium rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-white/20 border border-white/20 hover:bg-white/30 active:scale-[0.98] backdrop-blur-sm"
                  >
                    下一步
                  </button>

                  <p className="text-[11px] text-white/30 text-center">
                    10 个回合 · 约 3 分钟 · 基于真实创业方法论
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="path-step"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="flex-1 flex flex-col"
              >
                {/* Path selection cards */}
                <div className="flex flex-col gap-3 mb-6">
                  {PATH_OPTIONS.map((option, index) => (
                    <motion.button
                      key={option.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.12, duration: 0.4 }}
                      onClick={() => handlePathSelect(option.path)}
                      className="w-full text-left p-4 bg-white/8 hover:bg-white/15 border border-white/10 hover:border-white/25 rounded-xl transition-all active:scale-[0.98] backdrop-blur-sm"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl mt-0.5">{option.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-medium text-white">
                            {option.title}
                          </p>
                          <p className="text-sm text-white/50 mt-0.5">
                            {option.desc}
                          </p>
                        </div>
                        <span className="text-white/20 mt-1">&rsaquo;</span>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Back button */}
                <div className="mt-auto mb-8">
                  <button
                    onClick={() => setStep('name')}
                    className="w-full py-3 text-sm text-white/40 hover:text-white/60 transition-colors"
                  >
                    &larr; 返回修改名字
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
