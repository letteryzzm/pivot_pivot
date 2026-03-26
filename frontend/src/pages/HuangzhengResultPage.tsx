import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useHuangzhengStore, computeHzSummary } from '../store/huangzhengStore.ts'
import { HUANGZHENG_SCENARIOS, HZ_TAGS } from '../game/huangzheng-scenarios.ts'
import { motion } from 'framer-motion'

function ContactSection() {
  const [contact, setContact] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    const trimmed = contact.trim()
    if (!trimmed) return

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    if (supabaseUrl && supabaseKey) {
      fetch(`${supabaseUrl}/rest/v1/hz_contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({ contact: trimmed }),
      }).catch(() => {})
    }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-amber-500/[0.06] border border-amber-500/15 rounded-xl p-4 text-center mb-4"
      >
        <p className="text-sm text-amber-200/80">收到了，稍后把文字稿发给你</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7, duration: 0.5 }}
      className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-4 flex flex-col gap-3 mb-4"
    >
      <p className="text-sm text-white/70 leading-relaxed">
        这些题目来自黄峥的公众号原文。留个联系方式，把完整文字稿发给你。
      </p>
      <input
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit() }}
        placeholder="微信 / 手机 / 邮箱"
        className="w-full bg-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 border border-white/10 focus:outline-none focus:border-amber-500/30 transition-colors"
      />
      <button
        onClick={handleSubmit}
        disabled={!contact.trim()}
        className="w-full py-3 text-sm font-medium rounded-xl bg-white/10 border border-white/15 hover:bg-white/15 active:scale-[0.98] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      >
        获取文字稿
      </button>
    </motion.div>
  )
}

export default function HuangzhengResultPage() {
  const navigate = useNavigate()
  const { choices, isFinished, reset } = useHuangzhengStore()

  useEffect(() => {
    if (!isFinished || choices.length === 0) {
      navigate('/huangzheng', { replace: true })
    }
  }, [isFinished, choices, navigate])

  if (!isFinished || choices.length === 0) return null

  const summary = computeHzSummary(choices)

  const handleRestart = () => {
    reset()
    navigate('/huangzheng')
  }

  const handleBackHome = () => {
    reset()
    navigate('/')
  }

  return (
    <div className="min-h-full flex flex-col text-white bg-[#0a0a0f]">
      <div className="flex flex-col px-4 py-6" style={{ minHeight: '874px' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <h1 className="text-xl font-bold text-white mb-2">
            你和黄峥的对比
          </h1>
          <div className="flex items-center justify-center gap-3">
            <span className="text-3xl font-bold text-amber-400">
              {summary.totalMatch}
            </span>
            <span className="text-sm text-white/50">
              / {summary.totalQuestions} 个选择一致
            </span>
          </div>
        </motion.div>

        {/* Summary sentence */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-amber-500/[0.08] rounded-xl p-4 border border-amber-500/15 mb-6"
        >
          <p className="text-sm text-amber-200/80 leading-relaxed text-center">
            你和黄峥在
            <span className={`font-medium ${summary.mostAligned.color}`}>
              「{summary.mostAligned.tag}」
            </span>
            上最一致
            {summary.mostAligned.tag !== summary.leastAligned.tag && (
              <>
                ，在
                <span className={`font-medium ${summary.leastAligned.color}`}>
                  「{summary.leastAligned.tag}」
                </span>
                上差异最大
              </>
            )}
          </p>
        </motion.div>

        {/* Tag breakdown */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-6"
        >
          <h3 className="text-xs text-white/40 mb-3 font-medium">
            各维度一致率
          </h3>
          <div className="flex flex-col gap-2">
            {summary.tagEntries.map((entry) => (
              <div key={entry.tag} className="flex items-center gap-3">
                <span
                  className={`text-xs w-16 text-right ${entry.color}`}
                >
                  {entry.tag}
                </span>
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-amber-400/60 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${entry.rate * 100}%` }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  />
                </div>
                <span className="text-xs text-white/40 font-mono w-10 text-right">
                  {entry.match}/{entry.total}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Per-question comparison list */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-6"
        >
          <h3 className="text-xs text-white/40 mb-3 font-medium">
            逐题对比
          </h3>
          <div className="flex flex-col gap-3">
            {choices.map((choice, index) => {
              const scenario = HUANGZHENG_SCENARIOS.find(
                (s) => s.id === choice.scenarioId,
              )
              if (!scenario) return null

              const userText = scenario.choices.find(
                (c) => c.id === choice.userChoiceId,
              )?.text
              const hzText = scenario.choices.find(
                (c) => c.id === choice.huangzhengChoiceId,
              )?.text
              const tagCfg = HZ_TAGS[choice.tag]

              return (
                <motion.div
                  key={choice.scenarioId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.05, duration: 0.3 }}
                  className="bg-white/[0.04] rounded-xl p-3 border border-white/[0.06]"
                >
                  {/* Question header */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs">
                      {choice.isMatch ? '\u{2705}' : '\u{274C}'}
                    </span>
                    <span className="text-xs font-medium text-white/70 flex-1">
                      {scenario.year} · {scenario.title}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded bg-white/5 ${tagCfg.color}`}
                    >
                      {tagCfg.label}
                    </span>
                  </div>

                  {choice.isMatch ? (
                    <p className="text-xs text-white/50 pl-5">
                      你们都选择了：{userText}
                    </p>
                  ) : (
                    <div className="pl-5 flex flex-col gap-1">
                      <p className="text-xs text-white/50">
                        <span className="text-white/30">你：</span>
                        {userText}
                      </p>
                      <p className="text-xs text-amber-300/60">
                        <span className="text-amber-400/40">黄峥：</span>
                        {hzText}
                      </p>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Contact form */}
        <ContactSection />

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-auto flex flex-col gap-3 pt-4"
        >
          <div className="bg-white/[0.04] rounded-xl p-4 border border-white/[0.06]">
            <p className="text-xs text-white/50 leading-relaxed italic">
              "我冷眼向过去稍稍回顾，只见它曲折灌溉的悲喜，都消失在一片亘古的荒漠。这才知道我的全部努力，不过完成了普通的生活。"
            </p>
            <p className="text-[10px] text-white/30 mt-2">
              — 黄峥 2020年致股东信引用
            </p>
          </div>

          <button
            onClick={handleRestart}
            className="w-full py-3 text-sm font-medium rounded-xl bg-amber-500/20 border border-amber-500/30 hover:bg-amber-500/30 active:scale-[0.98] transition-all text-amber-200"
          >
            重新测试
          </button>
          <button
            onClick={handleBackHome}
            className="w-full py-2.5 text-xs text-white/30 hover:text-white/50 transition-colors"
          >
            返回首页
          </button>
        </motion.div>
      </div>
    </div>
  )
}
