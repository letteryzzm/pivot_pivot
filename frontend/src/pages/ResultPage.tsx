import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../store/gameStore.ts'
import { callAPIStream } from '../utils/api.ts'
import { getSourcesByIds } from '../game/sources.ts'
import type { Source } from '../game/sources.ts'
import type { DiagnosticBlindSpot } from '../types/game.ts'
import { getSessionId, SUPABASE_URL, SUPABASE_KEY } from '../utils/tracker.ts'
import LoadingDots from '../components/LoadingDots.tsx'
import { motion, AnimatePresence } from 'framer-motion'

const STAGE_LABELS: Record<string, string> = {
  idea: '想法阶段',
  build: '构建阶段',
  validate: '验证阶段',
  grow: '增长阶段',
  survive: '瓶颈期',
}

const stagger = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
}

function SourceCard({
  source,
  showInsight = false,
}: {
  readonly source: Source
  readonly showInsight?: boolean
}) {
  return (
    <div className="bg-white/[0.06] border border-white/10 rounded-xl p-4 flex flex-col gap-2">
      <h4 className="text-sm font-semibold text-white/90 leading-snug">
        {source.title}
      </h4>
      <p className="text-xs text-white/60 leading-relaxed">
        {source.oneLiner}
      </p>
      {showInsight && source.insight && (
        <p className="text-xs text-amber-300/80 leading-relaxed italic">
          {source.insight}
        </p>
      )}
      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors mt-1"
      >
        <span>&rarr;</span> 读原文
      </a>
    </div>
  )
}

function BlindSpotCard({
  spot,
  sources,
}: {
  readonly spot: DiagnosticBlindSpot
  readonly sources: readonly Source[]
}) {
  const firstSource = sources[0] ?? null
  return (
    <div className="bg-white/[0.06] border border-white/10 rounded-xl p-4 flex flex-col gap-2">
      <h4 className="text-sm font-bold text-white/90">{spot.title}</h4>
      <p className="text-xs text-white/70 leading-relaxed">
        {spot.description}
      </p>
      {firstSource && (
        <a
          href={firstSource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors mt-1"
        >
          <span>&rarr;</span> 查看原文
        </a>
      )}
    </div>
  )
}

function buildAdvicePrompt(
  founderType: string,
  stageSignal: string,
  blindSpots: readonly DiagnosticBlindSpot[],
  selfIntro: string
): string {
  const blindSpotTexts = blindSpots
    .map((s) => `- ${s.title}: ${s.description}`)
    .join('\n')
  return `你是一位资深天使投资人和创业导师，见过上万名创业者。以下是一位创业者的诊断结果：
- 创业者类型：${founderType}
- 阶段信号：${STAGE_LABELS[stageSignal] ?? stageSignal}
- 决策盲区：
${blindSpotTexts}

他的自我介绍：${selfIntro}

请用 200 字以内给出：
1. 对他创业素质的真实评价（优势和不足各一句）
2. 最关键的一条行动建议
语气像一个看过6000+年轻创业者的前辈在聊天，温暖但真实，不说空话。`
}

async function submitContactInfo(data: {
  sessionId: string
  name: string
  contact: string
  selfIntro: string
  founderType: string
  score: number
}) {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/contact_submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      body: JSON.stringify({
        session_id: data.sessionId,
        player_name: data.name,
        contact: data.contact,
        self_intro: data.selfIntro,
        founder_type: data.founderType,
        score: data.score,
        created_at: new Date().toISOString(),
      }),
    })
  } catch {
    // Silent fail - don't block the user
  }
}

export default function ResultPage() {
  const navigate = useNavigate()
  const { result, playerName, resetGame } = useGameStore()

  // Gate state
  const [unlocked, setUnlocked] = useState(false)
  const [contactName, setContactName] = useState('')
  const [contactInfo, setContactInfo] = useState('')
  const [selfIntro, setSelfIntro] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // AI advice state
  const [aiAdvice, setAiAdvice] = useState('')
  const [isLoadingAi, setIsLoadingAi] = useState(false)

  const [showSharePlaceholder, setShowSharePlaceholder] = useState(false)
  const hasRedirected = useRef(false)

  useEffect(() => {
    if (!result && !hasRedirected.current) {
      hasRedirected.current = true
      navigate('/', { replace: true })
    }
  }, [result, navigate])

  if (!result) return null

  const recommendedSources = getSourcesByIds(result.recommendedSources.slice(0, 5))
  const blindSpotSources = result.blindSpots.map((spot) =>
    getSourcesByIds(spot.sourceIds)
  )

  const canSubmit =
    contactName.trim().length > 0 &&
    contactInfo.trim().length > 0 &&
    selfIntro.trim().length >= 50

  const handleUnlock = async () => {
    if (!canSubmit) return

    setIsSubmitting(true)

    // Save contact info
    await submitContactInfo({
      sessionId: getSessionId(),
      name: contactName.trim(),
      contact: contactInfo.trim(),
      selfIntro: selfIntro.trim(),
      founderType: result.founderType,
      score: result.score,
    })

    // Generate AI advice
    setIsLoadingAi(true)
    try {
      const prompt = buildAdvicePrompt(
        result.title,
        result.stageSignal,
        result.blindSpots,
        selfIntro.trim()
      )
      let accumulated = ''
      await callAPIStream(prompt, (chunk) => {
        accumulated += chunk
        setAiAdvice(accumulated)
      })
    } catch {
      setAiAdvice('暂时无法生成建议，但你已经在行动了，这比任何建议都重要。')
    } finally {
      setIsLoadingAi(false)
    }

    setIsSubmitting(false)
    setUnlocked(true)
  }

  const handleRestart = () => {
    resetGame()
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-full flex flex-col text-white bg-[#0a0a0f] overflow-y-auto">
      <div className="flex flex-col max-w-lg mx-auto w-full px-5 py-6 gap-6">

        {/* ========================================= */}
        {/* PART 1: Always visible (teaser)           */}
        {/* ========================================= */}

        {/* 1. Personality Type */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-3 text-center"
        >
          <p className="text-xs text-white/40">
            {playerName} 的创业者画像
          </p>
          <h1 className="text-2xl font-bold text-white">
            {result.title}
          </h1>
          {result.isHidden && (
            <span className="px-2 py-0.5 text-[10px] rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300">
              隐藏结局
            </span>
          )}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300">
              得分 {result.score}
            </span>
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-500/20 border border-green-400/30 text-green-300">
              超过 {result.percentile}% 的人
            </span>
          </div>
        </motion.div>

        {/* 2. Description (visible) */}
        <motion.div
          custom={1}
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="bg-white/[0.06] border border-white/10 rounded-2xl p-5"
        >
          <p className="text-sm text-white/80 leading-relaxed">
            {result.description}
          </p>
        </motion.div>

        {/* 3. Stats preview */}
        <motion.div
          custom={2}
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-4 gap-3"
        >
          {Object.entries(result.stats).map(([key, value]) => {
            const labels: Record<string, string> = {
              judgment: '判断力',
              action: '行动力',
              cognition: '认知',
              connection: '连接力',
            }
            return (
              <div key={key} className="flex flex-col items-center gap-1 bg-white/[0.04] rounded-lg p-2">
                <span className="text-[10px] text-white/50">{labels[key]}</span>
                <span className="text-lg font-bold text-white/90">{value}</span>
              </div>
            )
          })}
        </motion.div>

        {/* ========================================= */}
        {/* GATE: Contact info + self-intro            */}
        {/* ========================================= */}

        <AnimatePresence mode="wait">
          {!unlocked ? (
            <motion.div
              key="gate"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col gap-4"
            >
              {/* Blurred preview of hidden content */}
              <div className="relative">
                <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 flex flex-col gap-3 blur-[6px] select-none pointer-events-none" aria-hidden>
                  <div className="h-3 w-24 bg-white/20 rounded" />
                  <div className="h-2 w-full bg-white/10 rounded" />
                  <div className="h-2 w-3/4 bg-white/10 rounded" />
                  <div className="h-2 w-5/6 bg-white/10 rounded" />
                  <div className="h-8 w-full bg-blue-500/10 rounded-lg mt-2" />
                  <div className="h-2 w-2/3 bg-white/10 rounded" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-[#0a0a0f]/90 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/20">
                    <p className="text-sm text-white/80 font-medium text-center">
                      填写信息解锁完整报告
                    </p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="bg-white/[0.06] border border-white/10 rounded-2xl p-5 flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <h2 className="text-base font-bold text-white/90">
                    解锁你的完整诊断报告
                  </h2>
                  <p className="text-xs text-white/50 leading-relaxed">
                    包含：决策盲点分析、个性化文章推荐、AI 定制建议。
                    我认识多位天使投资人，如果你的背景和项目真的合适，我可以直接推荐。
                  </p>
                </div>

                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-white/50">真实姓名</label>
                  <input
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="你的名字"
                    className="w-full bg-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/30 border border-white/10 focus:outline-none focus:border-indigo-500/50 transition-colors"
                  />
                </div>

                {/* Contact */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-white/50">联系方式（微信号 / 手机 / 邮箱）</label>
                  <input
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    placeholder="方便我们联系你"
                    className="w-full bg-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/30 border border-white/10 focus:outline-none focus:border-indigo-500/50 transition-colors"
                  />
                </div>

                {/* Self-intro */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-white/50">
                    介绍下自己的背景（年龄、学历、经历、正在做的事等）
                  </label>
                  <p className="text-[10px] text-amber-400/70 leading-relaxed">
                    小声bb：这几天认识了几个天使投资人，写得越详细他们越可能联系你
                  </p>
                  <textarea
                    value={selfIntro}
                    onChange={(e) => setSelfIntro(e.target.value)}
                    placeholder={"例如：我今年22岁，浙大计算机大三在读。做过一个校园外卖小程序，有1000+用户但没有收入。现在想用AI做一个帮助实验室自动处理数据的工具，已经和3个教授聊过需求...\n\n写得越真实越好，至少50字"}
                    rows={6}
                    className="w-full bg-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/30 border border-white/10 focus:outline-none focus:border-indigo-500/50 transition-colors resize-none leading-relaxed"
                  />
                  <p className="text-[10px] text-white/30 text-right">
                    {selfIntro.length} 字{selfIntro.trim().length < 50 ? `（至少还需要 ${50 - selfIntro.trim().length} 字）` : ' ✓'}
                  </p>
                </div>

                {/* Submit */}
                <button
                  onClick={handleUnlock}
                  disabled={!canSubmit || isSubmitting}
                  className="w-full py-3 bg-indigo-500/80 border border-indigo-400/30 rounded-xl text-sm text-white font-medium hover:bg-indigo-500/90 active:scale-[0.98] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? '正在生成报告...' : '解锁完整报告'}
                </button>
              </div>

              {/* Restart without unlocking */}
              <button
                onClick={handleRestart}
                className="text-xs text-white/30 hover:text-white/50 transition-colors py-2 text-center"
              >
                暂不填写，重新开始
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="unlocked"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-6"
            >

              {/* ========================================= */}
              {/* PART 2: Unlocked content                   */}
              {/* ========================================= */}

              {/* Advice */}
              <div className="bg-white/[0.06] border border-white/10 rounded-2xl p-5 flex flex-col gap-2">
                <p className="text-xs text-white/40 mb-1">下一步行动</p>
                <p className="text-xs text-white/70 leading-relaxed">
                  {result.advice}
                </p>
              </div>

              {/* Fingerprints */}
              {result.fingerprints.length > 0 && (
                <div className="flex flex-col gap-2">
                  <h2 className="text-sm font-semibold text-white/80">
                    你的决策指纹
                  </h2>
                  <div className="flex flex-col gap-1.5">
                    {result.fingerprints.map((fp, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 px-3 py-2 bg-white/[0.04] rounded-lg"
                      >
                        <span className="text-xs text-white/30 mt-0.5">{i + 1}.</span>
                        <span className="text-xs text-white/70 leading-relaxed">{fp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Blind Spots */}
              {result.blindSpots.length > 0 && (
                <div className="flex flex-col gap-3">
                  <h2 className="text-sm font-semibold text-white/80">
                    盲区诊断
                  </h2>
                  {result.blindSpots.map((spot, i) => (
                    <BlindSpotCard key={i} spot={spot} sources={blindSpotSources[i]} />
                  ))}
                </div>
              )}

              {/* Recommended Articles */}
              {recommendedSources.length > 0 && (
                <div className="flex flex-col gap-3">
                  <h2 className="text-sm font-semibold text-white/80">
                    推荐阅读
                  </h2>
                  {recommendedSources.map((source) => (
                    <SourceCard key={source.id} source={source} showInsight />
                  ))}
                </div>
              )}

              {/* AI Advice */}
              <div className="bg-white/[0.06] border border-white/10 rounded-2xl p-5 flex flex-col gap-2">
                <h2 className="text-sm font-semibold text-white/90">
                  AI 个性化建议
                </h2>
                {isLoadingAi && !aiAdvice ? (
                  <div className="flex items-center gap-2 text-xs text-white/60">
                    <LoadingDots /> <span>正在基于你的背景生成建议...</span>
                  </div>
                ) : (
                  <p className="text-sm text-white/80 leading-relaxed">
                    {aiAdvice}
                  </p>
                )}
              </div>

              {/* Investor note */}
              <div className="bg-amber-500/[0.08] border border-amber-400/20 rounded-xl p-4">
                <p className="text-xs text-amber-300/80 leading-relaxed">
                  小声bb：这些天认识了很多人，就有投资人，可以多写点，我保证他们触达（doge）
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setShowSharePlaceholder(true)}
                  className="w-full flex items-center gap-3 bg-white/[0.06] border border-white/10 rounded-xl p-4 hover:bg-white/[0.1] active:scale-[0.98] transition-all text-left"
                >
                  <div className="flex-1">
                    <p className="text-sm text-white/80 font-medium">分享结果</p>
                    <p className="text-[10px] text-white/40 mt-0.5">让朋友也来测测</p>
                  </div>
                </button>

                <button
                  onClick={handleRestart}
                  className="w-full flex items-center gap-3 bg-white/[0.06] border border-white/10 rounded-xl p-4 hover:bg-white/[0.1] active:scale-[0.98] transition-all text-left"
                >
                  <div className="flex-1">
                    <p className="text-sm text-white/80 font-medium">重新开始</p>
                    <p className="text-[10px] text-white/40 mt-0.5">换一种选择再玩一次</p>
                  </div>
                </button>
              </div>

              {/* Quote */}
              <p className="text-[10px] text-white/30 italic text-center pb-4">
                "创业最宝贵的不是赚钱机会，而是成长密度" — Roderick
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Share modal */}
      {showSharePlaceholder && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-6"
          onClick={() => setShowSharePlaceholder(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1a1a2e] border border-white/10 rounded-2xl p-6 max-w-sm w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm text-white/80">分享功能开发中</p>
            <p className="text-xs text-white/40 mt-2">可以先截图分享给朋友</p>
            <button
              onClick={() => setShowSharePlaceholder(false)}
              className="mt-4 px-6 py-2 bg-white/10 rounded-lg text-xs text-white/70 hover:bg-white/20 transition-colors"
            >
              知道了
            </button>
          </motion.div>
        </div>
      )}
    </div>
  )
}
