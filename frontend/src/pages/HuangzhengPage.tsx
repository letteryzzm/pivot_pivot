import { useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useHuangzhengStore } from '../store/huangzhengStore.ts'
import { TOTAL_HZ_QUESTIONS } from '../game/huangzheng-scenarios.ts'
import type { HzChoice } from '../game/huangzheng-scenarios.ts'
import { HZ_TAGS } from '../game/huangzheng-scenarios.ts'
import { motion, AnimatePresence } from 'framer-motion'

export default function HuangzhengPage() {
  const navigate = useNavigate()
  const {
    currentQuestion,
    isPlaying,
    isFinished,
    phase,
    scenarios,
    currentUserChoice,
    makeChoice,
    nextQuestion,
    startQuiz,
  } = useHuangzhengStore()

  // Auto-start on mount
  useEffect(() => {
    if (!isPlaying) startQuiz()
  }, [isPlaying, startQuiz])

  useEffect(() => {
    if (isFinished) navigate('/huangzheng/result', { replace: true })
  }, [isFinished, navigate])

  const handleChoiceSelect = useCallback(
    (choice: HzChoice) => {
      if (phase !== 'choose') return
      makeChoice(choice.id)
    },
    [phase, makeChoice],
  )

  const handleContinue = useCallback(() => {
    nextQuestion()
  }, [nextQuestion])

  if (!isPlaying || currentQuestion >= TOTAL_HZ_QUESTIONS) return null

  const scenario = scenarios[currentQuestion]
  const progress = ((currentQuestion + 1) / TOTAL_HZ_QUESTIONS) * 100
  const tagConfig = HZ_TAGS[scenario.tag]

  // Find user's choice text and huang zheng's choice text for reveal
  const userChoiceText =
    currentUserChoice
      ? scenario.choices.find((c) => c.id === currentUserChoice)?.text
      : ''
  const hzChoiceText = scenario.choices.find(
    (c) => c.id === scenario.huangzhengChoice,
  )?.text
  const isMatch = currentUserChoice === scenario.huangzhengChoice

  return (
    <div className="min-h-full flex flex-col text-white bg-[#0a0a0f]">
      <div
        className="flex flex-col"
        style={{ minHeight: '874px' }}
      >
        {/* Top bar */}
        <div className="px-4 pt-3 pb-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-white/50">黄峥的创业人生</span>
            <span className="text-xs text-white/50 font-mono">
              {currentQuestion + 1}/{TOTAL_HZ_QUESTIONS}
            </span>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-amber-500/70 rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col px-4 pb-4">
          <AnimatePresence mode="wait">
            {phase === 'choose' ? (
              <motion.div
                key={`q-${scenario.id}`}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col"
              >
                {/* Year & title */}
                <div className="mt-4 mb-1">
                  <span className="text-xs font-mono text-amber-400/60">
                    {scenario.year}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white/90 mb-3">
                  {scenario.title}
                </h2>

                {/* Tag */}
                <div className="mb-4">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 ${tagConfig.color}`}
                  >
                    {tagConfig.label}
                  </span>
                </div>

                {/* Description */}
                <div className="bg-white/[0.04] rounded-xl p-4 border border-white/[0.06] mb-5">
                  <p className="text-sm text-white/75 leading-relaxed">
                    {scenario.description}
                  </p>
                </div>

                {/* Choices */}
                <div className="flex flex-col gap-2.5">
                  {scenario.choices.map((choice, index) => {
                    const letter = String.fromCharCode(65 + index)
                    return (
                      <motion.button
                        key={choice.id}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleChoiceSelect(choice)}
                        className="w-full text-left px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all"
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
                key={`r-${scenario.id}`}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col mt-4"
              >
                {/* Match indicator */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">
                    {isMatch ? '\u{2705}' : '\u{1F914}'}
                  </span>
                  <span className="text-sm text-white/60">
                    {isMatch
                      ? '你和黄峥做了同样的选择'
                      : '你和黄峥的选择不同'}
                  </span>
                </div>

                {/* Comparison */}
                <div className="flex flex-col gap-3 mb-4">
                  {/* User's choice */}
                  <div className="bg-white/[0.06] rounded-xl p-3 border border-white/10">
                    <p className="text-[10px] text-white/40 mb-1">你的选择</p>
                    <p className="text-sm text-white/80">{userChoiceText}</p>
                  </div>

                  {/* Huang Zheng's choice */}
                  {!isMatch && (
                    <div className="bg-amber-500/[0.08] rounded-xl p-3 border border-amber-500/20">
                      <p className="text-[10px] text-amber-400/60 mb-1">
                        黄峥的选择
                      </p>
                      <p className="text-sm text-amber-200/80">
                        {hzChoiceText}
                      </p>
                    </div>
                  )}
                </div>

                {/* Huang Zheng's thinking */}
                <div className="bg-white/[0.04] rounded-xl p-4 border border-white/[0.06] mb-6">
                  <p className="text-[10px] text-amber-400/50 mb-2 font-medium">
                    黄峥的思考
                  </p>
                  <p className="text-sm text-white/70 leading-relaxed">
                    {scenario.huangzhengSay}
                  </p>
                </div>

                {/* Continue button */}
                <div className="mt-auto pb-4">
                  <button
                    onClick={handleContinue}
                    className="w-full py-3.5 text-sm font-medium rounded-xl bg-amber-500/20 border border-amber-500/30 hover:bg-amber-500/30 active:scale-[0.98] transition-all text-amber-200"
                  >
                    {currentQuestion < TOTAL_HZ_QUESTIONS - 1
                      ? '下一个选择'
                      : '查看完整对比'}
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
