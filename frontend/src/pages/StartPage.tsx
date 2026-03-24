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
  const [step, setStep] = useState<'intro' | 'name' | 'path'>('intro')
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
        <div className="h-8" />

        <div className="flex-1 flex flex-col px-5">
          <AnimatePresence mode="wait">
            {step === 'intro' ? (
              <motion.div
                key="intro-step"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="flex-1 flex flex-col"
              >
                {/* Claw */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="flex flex-col items-center gap-2 mb-4"
                >
                  <ClawSprite stage="baby" mood="idle" size={100} />
                </motion.div>

                {/* Title */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="text-center mb-5"
                >
                  <h1 className="text-2xl font-bold tracking-tight text-white">
                    创业者自测
                  </h1>
                  <p className="text-xs text-white/50 mt-1">
                    在 AI 时代，如何开始
                  </p>
                </motion.div>

                {/* Description */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="flex flex-col gap-4 mb-6"
                >
                  <div className="bg-white/[0.08] backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <p className="text-sm text-white/80 leading-relaxed">
                      这不是性格测试。
                    </p>
                    <p className="text-sm text-white/70 leading-relaxed mt-2">
                      你将经历 10 个真实的创业场景——从发现问题、验证用户、做出 MVP，到面对失败、团队危机和至暗时刻。每一个场景都来自真实创业者的经历。
                    </p>
                    <p className="text-sm text-white/70 leading-relaxed mt-2">
                      你的每一个选择，都会被记录和分析。
                    </p>
                  </div>

                  {/* What you'll get */}
                  <div className="flex flex-col gap-2.5 px-1">
                    <p className="text-xs text-white/40 font-medium">完成后你会获得：</p>
                    {[
                      '你的创业者类型和四维能力画像',
                      '决策盲点诊断——你可能没意识到的思维惯性',
                      '个性化文章推荐——基于你的选择匹配最相关的深度内容',
                      'AI 定制建议——结合你的背景给出具体行动方向',
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.08, duration: 0.3 }}
                        className="flex items-start gap-2"
                      >
                        <span className="text-indigo-400 text-xs mt-0.5">{'>'}</span>
                        <span className="text-xs text-white/60 leading-relaxed">{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Quote */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="mb-6 px-2"
                >
                  <div className="bg-white/[0.06] rounded-lg p-3 border border-white/[0.08]">
                    <p className="text-xs text-white/60 leading-relaxed italic">
                      "这一代人如果不在AI时代做一次创业尝试，可能注定终身为其他人的公司或Agent打工。"
                    </p>
                    <p className="text-[10px] text-white/30 mt-2">— Roderick</p>
                  </div>
                </motion.div>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.4 }}
                  className="flex flex-col gap-3 mt-6"
                >
                  <button
                    onClick={() => setStep('name')}
                    className="w-full py-3.5 text-base font-medium rounded-xl bg-indigo-500/80 border border-indigo-400/30 hover:bg-indigo-500/90 active:scale-[0.98] transition-all"
                  >
                    开始测试
                  </button>
                  <p className="text-[10px] text-white/30 text-center">
                    10 个场景 · 约 3 分钟 · 基于 6000+ 创业者的真实数据
                  </p>
                </motion.div>
              </motion.div>
            ) : step === 'name' ? (
              <motion.div
                key="name-step"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="flex-1 flex flex-col"
              >
                {/* Claw */}
                <div className="flex flex-col items-center gap-3 mb-6 mt-8">
                  <ClawSprite stage="baby" mood="idle" size={120} />
                </div>

                <div className="flex flex-col items-center gap-1 mb-8">
                  <h2 className="text-xl font-bold text-white">
                    给你的角色起个名字
                  </h2>
                  <p className="text-xs text-white/50">
                    它会陪你经历这 10 个创业抉择
                  </p>
                </div>

                <div className="flex flex-col gap-4 mt-6">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    maxLength={20}
                    className="w-full h-12 px-4 bg-white/10 border border-white/20 rounded-xl text-base text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50 focus:bg-white/15 transition-all"
                    placeholder="输入名字"
                    autoFocus
                  />

                  <button
                    onClick={handleNameSubmit}
                    disabled={name.trim().length === 0}
                    className="w-full py-3.5 text-base font-medium rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-indigo-500/80 border border-indigo-400/30 hover:bg-indigo-500/90 active:scale-[0.98]"
                  >
                    下一步
                  </button>

                  <button
                    onClick={() => setStep('intro')}
                    className="text-xs text-white/30 hover:text-white/50 transition-colors py-1"
                  >
                    返回
                  </button>
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
                <div className="flex flex-col items-center gap-1 mb-6 mt-8">
                  <h2 className="text-xl font-bold text-white">
                    {name.trim()}，你现在处于哪个阶段？
                  </h2>
                  <p className="text-xs text-white/50">
                    这会影响你遇到的场景
                  </p>
                </div>

                <div className="flex flex-col gap-3 mb-6">
                  {PATH_OPTIONS.map((option, index) => (
                    <motion.button
                      key={option.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                      onClick={() => handlePathSelect(option.path)}
                      className="w-full text-left p-4 bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 hover:border-white/25 rounded-xl transition-all active:scale-[0.98] backdrop-blur-sm"
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
                      </div>
                    </motion.button>
                  ))}
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => setStep('name')}
                    className="w-full py-3 text-sm text-white/30 hover:text-white/50 transition-colors"
                  >
                    返回修改名字
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
