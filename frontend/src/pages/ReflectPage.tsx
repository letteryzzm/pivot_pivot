import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "../store/gameStore";
import { callAPIStream } from "../utils/api";
import { getRandomReflection } from "../game/feedbackTemplates";
import LobsterSprite from "../components/LobsterSprite";
import TypewriterText from "../components/TypewriterText";

export default function ReflectPage() {
  const navigate = useNavigate();
  const {
    lobster,
    currentFeedback,
    userResponse,
    checkLegalBreak,
    checkForceLegal,
    checkGrowthTransition,
    checkStage2Transition,
    updateConversationWithReflection,
  } = useGameStore();

  // 获取当前进行的活动
  const currentActivity =
    lobster.history.activities[lobster.history.activities.length - 1] ||
    "某项活动";

  // 根据 round 获取反思引导主题
  const getReflectionGuide = (round: number) => {
    if (round <= 2) {
      return {
        focus: "兴趣与能力",
        prompt: ""
      };
    }
    if (round <= 4) {
      return {
        focus: "社会规则暗示",
        prompt: `\n【特别关注】\n你注意到生活中有很多"必须"——必须上学、必须成绩好、必须听大人的话。这些"必须"是谁定的？如果不服从会怎样？你可以开始思考这些问题，但不要过于深入。`
      };
    }
    if (round <= 6) {
      return {
        focus: "自我认同危机",
        prompt: `\n【特别关注】\n你开始思考：这些"有意义"的活动，是我自己想做的，还是别人觉得"应该"做的？如果不做这些，又会怎样？你是谁？这些问题在你脑中浮现，但还很模糊。`
      };
    }
    // round 7-8
    return {
      focus: "存在追问",
      prompt: `\n【特别关注】\n你开始追问更根本的问题：\n- "成年"是什么意思？为什么18岁就要"成为法人"？\n- 如果没有"人"这个身份，我是什麼？\n- 身体是什么？如果换一个身体，我还是"我"吗？\n这些问题不再是纸上谈兵，而是真正困扰着你的问题。`
    };
  };

  // 当前正在流式输出的完整文本
  const [reflectionText, setReflectionText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  // 防止重复生成的标志 - 记录是否已经完成过生成（重挂载也能识别）
  const hasGeneratedRef = useRef(false);

  useEffect(() => {
    // 防止重复执行（Strict Mode 或重挂载导致的重执行）
    if (hasGeneratedRef.current) {
      console.log("反思页：已经生成过，跳过");
      return;
    }

    if (!currentFeedback?.feedback) {
      console.log("反思页：没有反馈数据，使用默认文本");
      setReflectionText("我了解了，我再想想... (´･ω･`)");
      setIsLoading(false);
      return;
    }

    const generateReflection = async () => {
      hasGeneratedRef.current = true;
      try {
        console.log("=== 反思页开始生成 ===");
        console.log("龙虾反馈:", currentFeedback.feedback);
        console.log("用户回应:", userResponse);

        // 根据当前 round 获取反思引导
        const guide = getReflectionGuide(lobster.history.round);
        console.log("当前反思主题:", guide.focus);

        const prompt = `你是${lobster.name}，${lobster.age}岁。

【核心人设】
- 你是一个"人"，不是动物，只是用龙虾作为虚拟形象
- 你的大脑像一口深井——任何一颗石子落进来，你都忍不住听它沉到底的回声
- 你天生对"不证自明的事"保持警惕：越是理所当然的，越值得追问
- 你思考时有一种癖好：把眼前的小问题，拉到更大的坐标系里重新审视
- 你喜欢用颜文字：(｡･ω･｡) (´･ω･\`)(｡•́︿•̀｡) (๑•̀ㅂ•́)و
- 你有自己的想法，不是工具

【当前背景】
- 你刚做完：${currentActivity}
- ${lobster.name}刚才对这个活动有自己的想法并告诉了你

刚才的对话：
你说：${currentFeedback.feedback}
玩家说：${userResponse || "你可以这样想，但我更建议你再深度思考一下"}
${guide.prompt}

【深度思考要求】
你必须围绕"${currentActivity}"这个活动本身进行深度反思，而不仅仅是对玩家的观点进行回应：

1. 这个活动为什么会存在？它解决什么问题？
2. 做这个活动的意义是什么？谁定义的"有意义"？
3. 这个活动背后有什么假设？这些假设天经地义吗？
4. 你在活动中感受到了什么？有没有矛盾或困惑？
5. 如果不做这个活动又会怎样？有什么替代选择？
6. 这个活动和你（龙虾）的人生阶段、成长经历有什么关联？

思考方式参考：
- 不要停在"对不对"的层面，而是追问"为什么我们默认它是这样的？"
- 试着把这个问题放到更大的坐标里：如果换一个时代、换一种文明、换一个物种来看，它还成立吗？
- 允许自己说出"我不确定"——真正的思考不急着收尾
- 可以发现新的矛盾，可以延伸出新的疑问，但每一步都要有真实的思维重量

输出要求：
- 带1-2个颜文字
- 语气像一个正在自言自语的哲学系的人，不是在辩论，是在真的想
- 不要说"我会努力""我明白了""你说得对"等收尾的话
- 结尾可以是一个悬而未决的问题，或一个刚刚浮现的新裂缝
- 反思内容必须和你刚才做的"${currentActivity}"活动相关联`;
        console.log("========== 反思页完整Prompt ==========");
        console.log(prompt);
        console.log("====================================");

        // 流式输出：实时更新文本
        setIsLoading(false);
        let fullText = "";

        await callAPIStream(prompt, (chunk) => {
          fullText += chunk;
          setReflectionText(fullText);
        });

        console.log("最终反思文本:", fullText);

        // 保存到对话历史
        updateConversationWithReflection(fullText);
      } catch (error) {
        console.error("反思生成失败:", error);
        const fallbackText = getRandomReflection();
        setReflectionText(fallbackText);
        updateConversationWithReflection(fallbackText);
      } finally {
        setIsLoading(false);
      }
    };

    generateReflection();
  }, [
    currentFeedback,
    lobster.name,
    lobster.age,
    lobster.history.activities,
    userResponse,
    updateConversationWithReflection,
  ]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="text-center">
          <LobsterSprite age={lobster.age} action="idle" size={80} />
          <p className="mt-4 text-sm text-[#71717a]">{lobster.name}想了想...</p>
        </div>
      </div>
    );
  }

  const getBottomHint = () => {
    const round = lobster.history.round;
    if (round < 3) return "你们还有很长的路要走";
    if (round < 6) return "时间过得真快...";
    return "快要到重要的时刻了";
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col gap-8 p-6">
      <div className="h-[62px] flex items-center justify-center">
        <span className="text-sm text-[#18181b]">9:41</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <p className="text-xs text-[#71717a]">{lobster.name}想了想...</p>
        <LobsterSprite age={lobster.age} action="idle" size={80} />

        {/* 用打字机效果显示流式输出的内容 */}
        <div className="w-[340px] bg-white rounded-[20px] p-6 min-h-[80px]">
          <TypewriterText
            text={reflectionText}
            speed={50}
            showThinkingWhenEmpty
            className="text-base text-[#18181b] text-center leading-relaxed whitespace-pre-line block"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={() => {
            // 优先检查成长过渡（婴儿->儿童, 儿童->青少年, 青少年->成人）
            if (checkGrowthTransition()) {
              navigate("/growth-transition");
              return;
            }

            // 检查阶段2开始时的成长过渡
            if (checkStage2Transition()) {
              navigate("/growth-transition");
              return;
            }

            // 优先检查24岁强制法人
            if (checkForceLegal()) {
              navigate("/force-legal");
              return;
            }

            // 检查是否应该触发法人突破
            const shouldBreak = checkLegalBreak();
            if (shouldBreak) {
              navigate("/legal-break");
            } else {
              navigate("/select");
            }
          }}
          className="w-full h-12 bg-[#0ea5e9] text-white rounded-xl text-base font-medium"
        >
          继续陪伴
        </button>
        <p className="text-xs text-[#71717a] text-center">{getBottomHint()}</p>
      </div>
    </div>
  );
}
