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
}

export default function ResultPage() {
  const navigate = useNavigate()
  const { result, stats, playerName, history, isFinished, resetGame } =
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

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="flex flex-col gap-3 pb-4"
          >
            <button
              onClick={() => setShowShareCard(true)}
              className="w-full py-3.5 text-sm font-medium rounded-xl bg-white/20 border border-white/25 hover:bg-white/30 active:scale-[0.98] transition-all"
            >
              分享结果
            </button>
            <button
              onClick={handleRestart}
              className="w-full py-3.5 text-sm font-medium rounded-xl bg-white/8 border border-white/10 hover:bg-white/15 active:scale-[0.98] transition-all text-white/60"
            >
              再来一次，做不同的选择
            </button>
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
