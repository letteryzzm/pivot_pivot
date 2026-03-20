import { useState, useEffect, useRef } from 'react';

interface TypewriterTextProps {
  text: string;
  // 每个字符之间的基础延迟（ms）
  speed?: number;
  className?: string;
  showCursor?: boolean;
  // text 为空时是否显示"思考中"三点动画
  showThinkingWhenEmpty?: boolean;
  // 打字完成回调
  onComplete?: () => void;
}

// 标点符号额外停顿，模拟"思考"节奏
const PAUSE_MAP: Record<string, number> = {
  '，': 120,
  '、': 80,
  '。': 350,
  '！': 300,
  '？': 300,
  '…': 450,
  '\n': 200,
  '~': 80,
  '·': 60,
};

function ThinkingDots() {
  return (
    <span className="inline-flex gap-1.5 items-center h-5">
      {[0, 160, 320].map((delay, i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 bg-[#a1a1aa] rounded-full"
          style={{
            display: 'inline-block',
            animation: `bounce 1.1s ease-in-out ${delay}ms infinite`,
          }}
        />
      ))}
    </span>
  );
}

export default function TypewriterText({
  text,
  speed = 50,
  className,
  showCursor = true,
  showThinkingWhenEmpty = false,
  onComplete,
}: TypewriterTextProps) {
  const [len, setLen] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const completedRef = useRef(false);
  // 用 ref 跟踪上一次 text 长度，解决快速更新时的同步问题
  const prevTextLenRef = useRef(0);

  // 文字打出逻辑：每次 len 或 text 变化时调度下一个字符
  useEffect(() => {
    // 当 text 变长时，确保 len 不会落后太多
    if (text.length > prevTextLenRef.current && len < text.length) {
      // text 变长了，继续从当前位置打
    } else if (text.length > 0 && len >= text.length) {
      // text 突然变长但 len 已经等于旧长度，需要继续
    }

    prevTextLenRef.current = text.length;

    if (len >= text.length) {
      if (text.length > 0 && !completedRef.current) {
        completedRef.current = true;
        onComplete?.();
      }
      return;
    }

    const ch = text[len];
    const extraPause = PAUSE_MAP[ch] ?? 0;

    timerRef.current = setTimeout(() => {
      setLen((l) => Math.min(l + 1, text.length));
    }, speed + extraPause);

    return () => clearTimeout(timerRef.current);
  }, [len, text, speed, onComplete]);

  // text 被清空时重置（新一轮开始）
  // 或者 text 变长时，如果 len 已经打完了，也要继续
  useEffect(() => {
    if (text === '') {
      setLen(0);
      completedRef.current = false;
      prevTextLenRef.current = 0;
    } else if (len >= prevTextLenRef.current && len < text.length) {
      // text 变长了，但 len 已经打到上一次的长度了，需要继续
      // 不需要额外操作，依赖下面的 useEffect 继续打
    }
  }, [text]);

  const isDone = text.length > 0 && len >= text.length;

  // 还没有任何文字时显示思考动画
  if (text === '' && showThinkingWhenEmpty) {
    return <ThinkingDots />;
  }

  return (
    <span className={className}>
      {text.slice(0, len)}
      {showCursor && !isDone && (
        <span
          className="inline-block align-middle"
          style={{
            width: '2px',
            height: '1em',
            backgroundColor: 'currentColor',
            marginLeft: '2px',
            animation: 'blink 1s infinite',
          }}
        />
      )}
    </span>
  );
}
