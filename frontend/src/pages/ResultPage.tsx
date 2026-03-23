import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../store/gameStore.ts'
import { callAPIStream } from '../utils/api.ts'
import { generateResultPrompt } from '../game/engine.ts'
import { fetchPercentile, getSessionId, SUPABASE_URL, SUPABASE_KEY } from '../utils/tracker.ts'
import ClawSprite from '../components/ClawSprite.tsx'
import TypewriterText from '../components/TypewriterText.tsx'
import LoadingDots from '../components/LoadingDots.tsx'
import ShareCard from '../components/ShareCard.tsx'
import { motion } from 'framer-motion'
import { getImagePath } from '../utils/imageUtils.ts'

const STAT_CONFIG: Record<
  string,
  { label: string; color: string; bar: string }
> = {
  judgment: { label: '判断力', color: 'text-blue-300', bar: 'bg-blue-400' },
  action: { label: '行动力', color: 'text-green-300', bar: 'bg-green-400' },
  cognition: { label: '认知', color: 'text-purple-300', bar: 'bg-purple-400' },
  connection: {
    label: '连接力',
    color: 'text-amber-300',
    bar: 'bg-amber-400',
  },
}

const ENDING_BACKGROUNDS: Record<string, string> = {
  founder: '/images/结局/科含结局背景.png',
  thinker: '/images/结局/作家结局背景.png',
  hustler: '/images/结局/赚钱机器结局_4.png',
  explorer: '/images/结局/自由自在结局背景.png',
  observer: '/images/结局/迷茫打工人结局_1.png',
  gambler: '/images/结局/赚钱机器结局_4.png',
  prophet: '/images/结局/科含结局背景.png',
  philosopher: '/images/结局/作家结局背景.png',
  polymath: '/images/结局/科含结局背景.png',
}

function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}秒`
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return secs > 0 ? `${mins}分${secs}秒` : `${mins}分钟`
}

export default function ResultPage() {
  const navigate = useNavigate()
  const { result, stats, playerName, history, isFinished, resetGame, scenarios, choiceTimes } =
    useGameStore()

  const [aiAdvice, setAiAdvice] = useState('')
  const [isLoadingAi, setIsLoadingAi] = useState(false)
  const [aiError, setAiError] = useState(false)
  const [rankData, setRankData] = useState<{
    percentile: number
    totalPlayers: number
    beatCount: number
  } | null>(null)
  const [showShareCard, setShowShareCard] = useState(false)
  const [showFullDesc, setShowFullDesc] = useState(false)
  const [showAi, setShowAi] = useState(false)
  const [showAdvice, setShowAdvice] = useState(false)
  const [contact, setContact] = useState('')
  const [contactSubmitted, setContactSubmitted] = useState(false)
  const hasGenerated = useRef(false)

  useEffect(() => {
    if (!isFinished || !result) {
      navigate('/', { replace: true })
      return
    }

    if (hasGenerated.current) return
    hasGenerated.current = true

    // Fetch AI advice
    const fetchAi = async () => {
      setIsLoadingAi(true)
      try {
        const prompt = generateResultPrompt(playerName, stats, history, result)
        let accumulated = ''
        await callAPIStream(prompt, (chunk) => {
          accumulated += chunk
          setAiAdvice(accumulated)
        })
      } catch {
        setAiError(true)
      } finally {
        setIsLoadingAi(false)
      }
    }

    // Fetch real percentile from Supabase
    const fetchRank = async () => {
      const data = await fetchPercentile(result.score)
      setRankData(data)
    }

    fetchAi()
    fetchRank()
  }, [isFinished, result, playerName, stats, history, navigate])

  const handleRestart = () => {
    resetGame()
    navigate('/', { replace: true })
  }

  const handleContactSubmit = async () => {
    const trimmed = contact.trim()
    if (!trimmed || !result) return

    try {
      await fetch(`${SUPABASE_URL}/rest/v1/game_contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          session_id: getSessionId(),
          player_name: playerName,
          score: result.score,
          founder_type: result.founderType,
          contact: trimmed,
        }),
      })
    } catch {
      // silent
    }
    setContactSubmitted(true)
  }

  if (!result) return null

  const bgImage = getImagePath(
    ENDING_BACKGROUNDS[result.founderType] || ENDING_BACKGROUNDS.explorer
  )
  const displayPercentile = rankData?.percentile ?? result.percentile
  const totalPlayers = rankData?.totalPlayers ?? 0

  // Decision time stats
  const validTimes = choiceTimes.length > 0 ? choiceTimes : []
  const avgTime = validTimes.length > 0
    ? Math.round(validTimes.reduce((a, b) => a + b, 0) / validTimes.length)
    : 0
  const longestTimeIndex = validTimes.length > 0
    ? validTimes.indexOf(Math.max(...validTimes))
    : -1
  const longestTimeScenario = longestTimeIndex >= 0 && scenarios[longestTimeIndex]
    ? scenarios[longestTimeIndex].title
    : null
  const longestTime = longestTimeIndex >= 0 ? validTimes[longestTimeIndex] : 0


  return (
    <div
      className="min-h-full flex flex-col text-white bg-cover bg-center overflow-y-auto"
      style={{ backgroundImage: `url('${bgImage}')` }}
    >
      <div
        className="flex flex-col bg-black/60 backdrop-blur-[2px]"
        style={{ minHeight: '874px' }}
      >
        <div className="px-5 py-4 flex flex-col gap-3">

          {/* === Header: ClawSprite + Title + Score inline === */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-1.5"
          >
            <ClawSprite stage="business" mood="idle" size={80} />
            <div className="text-center">
              <p className="text-[10px] text-white/60">
                {playerName} 成长为了
              </p>
              <h1 className="text-2xl font-bold text-white">{result.title}</h1>
              {result.isHidden && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="inline-block mt-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300"
                >
                  隐藏结局
                </motion.span>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-white/60 mt-0.5">
              <span>创业者指数 <strong className="text-white">{result.score}</strong></span>
              <span className="text-white/20">|</span>
              <span>超越 <strong className="text-white">{displayPercentile}%</strong> 玩家</span>
            </div>
            {totalPlayers > 0 && (
              <p className="text-[10px] text-white/70">
                共 {totalPlayers} 人完成旅程，超越 {rankData?.beatCount ?? 0} 人
              </p>
            )}
          </motion.div>

          {/* === Stat Bars (no card wrapper) === */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col gap-1.5"
          >
            <p className="text-[10px] text-white/60">能力画像</p>
            {Object.entries(stats).map(([key, value]) => {
              const config = STAT_CONFIG[key]
              return (
                <div key={key} className="flex items-center gap-2">
                  <span className={`text-[11px] w-10 ${config.color}`}>
                    {config.label}
                  </span>
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${config.bar}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${value}%` }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                    />
                  </div>
                  <span className="text-[11px] text-white/70 w-7 text-right font-mono">
                    {value}
                  </span>
                </div>
              )
            })}
          </motion.div>

          {/* === Decision Fingerprints (no card wrapper) === */}
          {result.fingerprints.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="flex flex-col gap-1"
            >
              <p className="text-[10px] text-white/60">决策指纹</p>
              {result.fingerprints.map((fp, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.15, duration: 0.4 }}
                  className="flex items-start gap-2"
                >
                  <span className="text-[10px] text-white/25 font-mono mt-0.5">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="text-xs text-white/75 leading-snug">{fp}</p>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* === Description (truncated 3 lines + expand) === */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col gap-1"
          >
            <p className="text-[10px] text-white/60">分析</p>
            <div className={showFullDesc ? '' : 'line-clamp-3'}>
              <TypewriterText
                text={result.description}
                speed={25}
                className="text-xs text-white/80 leading-snug block"
                showCursor={false}
              />
            </div>
            <button
              onClick={() => setShowFullDesc((prev) => !prev)}
              className="text-[10px] text-white/60 hover:text-white/60 transition-colors self-start"
            >
              {showFullDesc ? '收起' : '展开全文'}
            </button>
          </motion.div>

          {/* === Decision Time (single inline row) === */}
          {validTimes.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.42, duration: 0.5 }}
              className="flex items-center gap-2 text-[11px] text-white/70"
            >
              <span>⏱</span>
              <span>平均 {formatTime(avgTime)}</span>
              {longestTimeScenario && (
                <>
                  <span className="text-white/20">|</span>
                  <span>最长 {formatTime(longestTime)}「{longestTimeScenario}」</span>
                </>
              )}
            </motion.div>
          )}

          {/* === AI Advice (accordion) === */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <button
              onClick={() => setShowAi((prev) => !prev)}
              className="flex justify-between items-center w-full py-1"
            >
              <span className="text-[10px] text-white/60">
                AI 寄语
                {isLoadingAi && !aiAdvice && ' (生成中...)'}
              </span>
              <span className="text-[10px] text-white/70">{showAi ? '▲' : '▼'}</span>
            </button>
            {showAi && (
              <div className="mt-1">
                {isLoadingAi && !aiAdvice ? (
                  <div className="flex items-center gap-2 text-xs text-white/60">
                    <LoadingDots /> <span>正在生成...</span>
                  </div>
                ) : aiError && !aiAdvice ? (
                  <p className="text-xs text-white/70 italic">
                    创业最重要的不是建议，而是你已经迈出了第一步。
                  </p>
                ) : (
                  <p className="text-xs text-white/80 leading-snug">
                    {aiAdvice}
                  </p>
                )}
              </div>
            )}
          </motion.div>

          {/* === Next Steps (accordion) === */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
          >
            <button
              onClick={() => setShowAdvice((prev) => !prev)}
              className="flex justify-between items-center w-full py-1"
            >
              <span className="text-[10px] text-white/60">下一步行动</span>
              <span className="text-[10px] text-white/70">{showAdvice ? '▲' : '▼'}</span>
            </button>
            {showAdvice && (
              <p className="text-xs text-white/80 leading-snug mt-1">
                {result.advice}
              </p>
            )}
          </motion.div>

          {/* === Contact inline === */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col gap-1.5"
          >
            {contactSubmitted ? (
              <p className="text-xs text-white/60 text-center py-1">已收到，我们会联系你</p>
            ) : (
              <>
                <p className="text-[10px] text-white/60 leading-snug">
                  如果你的某一维度超过了 90 或有两个超过了 80，截图填写联系方式
                </p>
                <div className="flex gap-2">
                  <input
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="微信/手机/邮箱"
                    className="flex-1 bg-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/70 border border-white/10 focus:outline-none focus:border-white/30 transition-colors"
                  />
                  <button
                    onClick={handleContactSubmit}
                    disabled={!contact.trim()}
                    className="px-4 py-2 bg-white/20 rounded-lg text-xs border border-white/25 hover:bg-white/30 active:scale-[0.98] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    发送
                  </button>
                </div>
              </>
            )}
          </motion.div>

          {/* === 3 Action Buttons (unchanged card-style) === */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="flex flex-col gap-2.5"
          >
            <button
              onClick={() => setShowShareCard(true)}
              className="w-full flex items-center gap-3 bg-white/8 border border-white/10 rounded-xl p-3 hover:bg-white/12 active:scale-[0.98] transition-all text-left"
            >
              <p className="flex-1 text-xs text-white/70 leading-relaxed">
                假如你有100万美金，你会投给谁？把这个游戏发给他，如果适合创业，给他投钱
              </p>
              <div className="w-9 h-9 rounded-lg bg-white/10 flex-shrink-0 flex items-center justify-center">
                <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
            </button>

            <button
              onClick={handleRestart}
              className="w-full flex items-center gap-3 bg-white/8 border border-white/10 rounded-xl p-3 hover:bg-white/12 active:scale-[0.98] transition-all text-left"
            >
              <p className="flex-1 text-xs text-white/70 leading-relaxed">
                觉得这不是真正的你，而是你想成为的你？再来一次
              </p>
              <div className="w-9 h-9 rounded-lg bg-white/10 flex-shrink-0 flex items-center justify-center">
                <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
            </button>

            <a
              href="https://lh9emykotk.feishu.cn/share/base/form/shrcnidjRDdc5Mnkx2JEmzaXfqf"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center gap-3 bg-white/8 border border-amber-400/20 rounded-xl p-3 hover:bg-white/12 active:scale-[0.98] transition-all text-left"
            >
              <p className="flex-1 text-xs text-white/70 leading-relaxed">
                这些问题都游刃有余？加微信凭截图查看你的完整选择过程
              </p>
              <div className="w-9 h-9 rounded-lg bg-amber-400/10 flex-shrink-0 flex items-center justify-center">
                <svg className="w-4 h-4 text-amber-400/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </a>
          </motion.div>

          {/* === Quote === */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="pb-2"
          >
            <p className="text-[10px] text-white/60 italic text-center">
              "创业最宝贵的不是赚钱机会，而是成长密度"
            </p>
          </motion.div>

        </div>
      </div>

      {showShareCard && (
        <ShareCard
          playerName={playerName}
          stats={stats}
          result={result}
          rankData={rankData}
          onClose={() => setShowShareCard(false)}
        />
      )}
    </div>
  )
}
