import { useState } from 'react'
import { motion } from 'framer-motion'

interface ContactFormProps {
  sessionId: string
  playerName: string
  score: number
  founderType: string
  supabaseUrl: string
  supabaseKey: string
}

export default function ContactForm({
  sessionId,
  playerName,
  score,
  founderType,
  supabaseUrl,
  supabaseKey,
}: ContactFormProps) {
  const [contact, setContact] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    const trimmed = contact.trim()
    if (!trimmed) return

    try {
      await fetch(`${supabaseUrl}/rest/v1/game_contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          session_id: sessionId,
          player_name: playerName,
          score,
          founder_type: founderType,
          contact,
        }),
      })
    } catch {
      // silent
    }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/8 border border-white/10 rounded-2xl p-4 backdrop-blur-sm text-center"
      >
        <p className="text-sm text-white/80">已收到，我们会联系你</p>
      </motion.div>
    )
  }

  return (
    <div className="bg-white/8 border border-white/10 rounded-2xl p-4 backdrop-blur-sm flex flex-col gap-3">
      <p className="text-xs text-white/40">想获取完整 10 轮决策分析报告？</p>
      <p className="text-sm text-white/70 leading-relaxed">
        我们会基于你的选择生成一份个人创业者诊断，包含决策倾向、盲点分析和创业方向建议。
      </p>
      <input
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        placeholder="微信 / 手机 / 邮箱（任选一个）"
        className="w-full bg-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 border border-white/10 focus:outline-none focus:border-white/30 transition-colors"
      />
      <button
        onClick={handleSubmit}
        disabled={!contact.trim()}
        className="w-full py-3 text-sm font-medium rounded-xl bg-white/20 border border-white/25 hover:bg-white/30 active:scale-[0.98] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      >
        获取报告
      </button>
    </div>
  )
}
