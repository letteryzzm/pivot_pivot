import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../store/gameStore.ts'
import { callAPIStream } from '../utils/api.ts'
import { generateResultPrompt } from '../game/engine.ts'
import { fetchPercentile, getSessionId, SUPABASE_URL, SUPABASE_KEY } from '../utils/tracker.ts'
import ContactForm from '../components/ContactForm.tsx'
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

const TEAM_KEYWORDS = ['团队', '合作', '伙伴', '合伙', '同事', '朋友', '一起', '协作']

function isTeamScenario(title: string, description: string): boolean {
  const text = title + description
  return TEAM_KEYWORDS.some((kw) => text.includes(kw))
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

  // Team vs solo time comparison
  const teamTimes: number[] = []
  const soloTimes: number[] = []
  validTimes.forEach((time, index) => {
    const scenario = scenarios[index]
    if (scenario && isTeamScenario(scenario.title, scenario.description)) {
      teamTimes.push(time)
    } else {
      soloTimes.push(time)
    }
  })
  const avgTeamTime = teamTimes.length > 0
    ? Math.round(teamTimes.reduce((a, b) => a + b, 0) / teamTimes.length)
    : 0
  const avgSoloTime = soloTimes.length > 0
    ? Math.round(soloTimes.reduce((a, b) => a + b, 0) / soloTimes.length)
    : 0
  const hasTeamComparison = teamTimes.length >= 2 && soloTimes.length >= 2

  return (
    <div
      className="min-h-full flex flex-col text-white bg-cover bg-center overflow-y-auto"
      style={{ backgroundImage: `url('${bgImage}')` }}
    >
      <div
        className="flex flex-col bg-black/60 backdrop-blur-[2px]"
        style={{ minHeight: '874px' }}
      >
        <div className="px-5 py-6 flex flex-col gap-5">
          {/* Claw in final form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-3"
          >
            <ClawSprite stage="business" mood="idle" size={120} />
            <div className="text-center">
              <p className="text-xs text-white/40 mb-1">
                {playerName} 成长为了
              </p>
              <h1 className="text-3xl font-bold text-white">{result.title}</h1>
              {/* Hidden ending badge */}
              {result.isHidden && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300"
                >
                  隐藏结局
                </motion.span>
              )}
            </div>
          </motion.div>

          {/* Score + Rank */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-white/8 border border-white/10 rounded-2xl p-5 backdrop-blur-sm"
          >
            <div className="flex items-center justify-center gap-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-white">{result.score}</p>
                <p className="text-[10px] text-white/40 mt-1">创业者指数</p>
              </div>
              <div className="w-px h-12 bg-white/15" />
              <div className="text-center">
                <p className="text-4xl font-bold text-white">
                  {displayPercentile}%
                </p>
                <p className="text-[10px] text-white/40 mt-1">超越玩家</p>
              </div>
            </div>
            {totalPlayers > 0 && (
              <p className="text-[10px] text-white/30 text-center mt-3">
                共 {totalPlayers} 人完成了这趟旅程，{playerName}超越了其中{' '}
                {rankData?.beatCount ?? 0} 人
              </p>
            )}
          </motion.div>

          {/* Stats radar-style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-white/8 border border-white/10 rounded-2xl p-4 backdrop-blur-sm"
          >
            <p className="text-xs text-white/40 mb-3">能力画像</p>
            <div className="flex flex-col gap-2.5">
              {Object.entries(stats).map(([key, value]) => {
                const config = STAT_CONFIG[key]
                return (
                  <div key={key} className="flex items-center gap-3">
                    <span className={`text-xs w-12 ${config.color}`}>
                      {config.label}
                    </span>
                    <div className="flex-1 h-2.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${config.bar}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${value}%` }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                      />
                    </div>
                    <span className="text-xs text-white/50 w-8 text-right font-mono">
                      {value}
                    </span>
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* Decision Fingerprints */}
          {result.fingerprints.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="bg-white/8 border border-white/10 rounded-2xl p-4 backdrop-blur-sm"
            >
              <p className="text-xs text-white/40 mb-3">决策指纹</p>
              <div className="flex flex-col gap-2">
                {result.fingerprints.map((fp, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.15, duration: 0.4 }}
                    className="flex items-start gap-2.5"
                  >
                    <span className="text-xs text-white/25 font-mono mt-0.5">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="text-sm text-white/75 leading-relaxed">{fp}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Decision Time Stats */}
          {validTimes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 0.5 }}
              className="bg-white/8 border border-white/10 rounded-2xl p-4 backdrop-blur-sm"
            >
              <p className="text-xs text-white/40 mb-3">决策时间</p>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/50">平均决策时间</span>
                  <span className="text-sm text-white/80 font-mono">
                    {formatTime(avgTime)}
                  </span>
                </div>
                {longestTimeScenario && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/50">
                      最长思考：{longestTimeScenario}
                    </span>
                    <span className="text-sm text-white/80 font-mono">
                      {formatTime(longestTime)}
                    </span>
                  </div>
                )}
                {hasTeamComparison && (
                  <div className="mt-1 pt-2 border-t border-white/5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/50">团队场景</span>
                      <span className="text-sm text-white/80 font-mono">
                        {formatTime(avgTeamTime)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-white/50">个人场景</span>
                      <span className="text-sm text-white/80 font-mono">
                        {formatTime(avgSoloTime)}
                      </span>
                    </div>
                    <p className="text-[10px] text-white/30 mt-1.5">
                      {avgTeamTime > avgSoloTime
                        ? '涉及他人时你会多花时间斟酌'
                        : avgTeamTime < avgSoloTime
                          ? '独自决策时你反而更加犹豫'
                          : '团队和个人场景的决策速度一致'}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-white/8 border border-white/10 rounded-2xl p-4 backdrop-blur-sm"
          >
            <p className="text-xs text-white/40 mb-2">分析</p>
            <TypewriterText
              text={result.description}
              speed={25}
              className="text-sm text-white/80 leading-relaxed block"
              showCursor={false}
            />
          </motion.div>

          {/* Advice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="bg-white/8 border border-white/10 rounded-2xl p-4 backdrop-blur-sm"
          >
            <p className="text-xs text-white/40 mb-2">下一步行动</p>
            <p className="text-sm text-white/80 leading-relaxed">
              {result.advice}
            </p>
          </motion.div>

          {/* AI advice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="bg-white/8 border border-white/10 rounded-2xl p-4 backdrop-blur-sm"
          >
            <p className="text-xs text-white/40 mb-2">AI 寄语</p>
            {isLoadingAi && !aiAdvice ? (
              <div className="flex items-center gap-2 text-sm text-white/40">
                <LoadingDots /> <span>正在生成...</span>
              </div>
            ) : aiError && !aiAdvice ? (
              <p className="text-sm text-white/50 italic">
                创业最重要的不是建议，而是你已经迈出了第一步。
              </p>
            ) : (
              <p className="text-sm text-white/80 leading-relaxed">
                {aiAdvice}
              </p>
            )}
          </motion.div>

          {/* Hint */}
          <p className="text-xs text-white/40 text-center leading-relaxed">
            如果你的某一维度超过了 90 或有两个超过了 80，请立刻截图并填写下方联系方式联系我们
          </p>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <ContactForm
              sessionId={getSessionId()}
              playerName={playerName}
              score={result.score}
              founderType={result.founderType}
              supabaseUrl={SUPABASE_URL}
              supabaseKey={SUPABASE_KEY}
            />
          </motion.div>

          {/* Quote */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="bg-white/5 rounded-xl p-3 border border-white/10"
          >
            <p className="text-xs text-white/40 italic leading-relaxed text-center">
              "创业最宝贵的不是赚钱机会，而是成长密度"
            </p>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="flex flex-col gap-3 pb-4"
          >
            <button
              onClick={() => setShowShareCard(true)}
              className="w-full flex items-center gap-3 bg-white/8 border border-white/10 rounded-xl p-3 hover:bg-white/12 active:scale-[0.98] transition-all text-left"
            >
              <p className="flex-1 text-xs text-white/50 leading-relaxed">
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
              <p className="flex-1 text-xs text-white/50 leading-relaxed">
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
              <p className="flex-1 text-xs text-white/50 leading-relaxed">
                这些问题都游刃有余？加微信凭截图查看你的完整选择过程
              </p>
              <div className="w-9 h-9 rounded-lg bg-amber-400/10 flex-shrink-0 flex items-center justify-center">
                <svg className="w-4 h-4 text-amber-400/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </a>
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
