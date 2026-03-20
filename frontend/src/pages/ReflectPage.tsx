import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "../store/gameStore";
import { callAPI, safeParseJSON } from "../utils/api";
import { getRandomReflection } from "../game/feedbackTemplates";
import { getReflectionImagePathById } from "../config/reflectionImages";
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
    checkAIEnding,
    updateConversationWithReflection,
    setReflectionEnding,
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
        prompt: "",
      };
    }
    if (round <= 4) {
      return {
        focus: "社会规则暗示",
        prompt: `\n【特别关注】\n你注意到生活中有很多"必须"——必须上学、必须成绩好、必须听大人的话。这些"必须"是谁定的？如果不服从会怎样？你可以开始思考这些问题，但不要过于深入。`,
      };
    }
    if (round <= 6) {
      return {
        focus: "自我认同危机",
        prompt: `\n【特别关注】\n你开始思考：这些"有意义"的活动，是我自己想做的，还是别人觉得"应该"做的？如果不做这些，又会怎样？你是谁？这些问题在你脑中浮现，但还很模糊。`,
      };
    }
    // round 7-8
    return {
      focus: "存在追问",
      prompt: `\n【特别关注】\n你开始追问更根本的问题：\n- "成年"是什么意思？为什么到了一定时机就要"成为法人"？\n- 如果没有"人"这个身份，我是什麼？\n- 身体是什么？如果换一个身体，我还是"我"吗？\n这些问题不再是纸上谈兵，而是真正困扰着你的问题。`,
    };
  };

  // 当前正在流式输出的完整文本
  const [reflectionText, setReflectionText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  // 背景图片 - 轮询不重复
  const [backgroundImage, setBackgroundImage] = useState<string>("");
  // 防止重复生成的标志
  const hasGeneratedRef = useRef(false);
  // 记录上一张使用的图片ID，避免连续重复
  const lastImageIdRef = useRef<number>(0);

  // 轮询获取下一张背景图（不重复）
  const getNextImageId = (round: number, lastId: number): number => {
    const isDeepRound = round > 4;
    const minId = isDeepRound ? 11 : 1;
    const maxId = isDeepRound ? 19 : 10;
    const range = maxId - minId + 1;

    // 尝试获取一个不重复的ID
    let attempts = 0;
    let newId = lastId;

    while (attempts < range) {
      newId = minId + Math.floor(Math.random() * range);
      if (newId !== lastId) {
        break;
      }
      attempts++;
    }

    return newId;
  };

  // 初始化背景图
  useEffect(() => {
    if (!backgroundImage) {
      const round = lobster.history.round;
      const imageId = getNextImageId(round, lastImageIdRef.current);
      lastImageIdRef.current = imageId;

      const imagePath = getReflectionImagePathById(imageId);
      setBackgroundImage(imagePath);

      console.log(
        `[反思页背景图] 轮询使用图片 ID: ${imageId}, 路径: ${imagePath}`,
      );
    }
  }, [lobster.history.round]);

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

        const stageText = lobster.stage === 1 ? "婴儿期" : "商务期";
        const prompt = `你是${lobster.name}，现在是${stageText}。

【核心人设】
- 你是一个"人"，不是动物，只是用龙虾作为虚拟形象
- 你的大脑像一口深井——任何一颗石子落进来，你都忍不住听它沉到底的回声
- 你天生对"不证自明的事"保持警惕：越是理所当然的，越值得追问
- 你思考时有一种癖好：把眼前的小问题，拉到更大的坐标系里重新审视
- 阶段一是婴儿的时候你喜欢用颜文字：(｡･ω･｡) (´･ω･\`)(｡•́︿•̀｡) (๑•̀ㅂ•́)و
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

输出要求：只输出JSON，不要任何解释文字。

{
  "reflection": "反思内容（最多150字，带1-2个颜文字，语气像一个正在自言自语的哲学系的人，不是在辩论，是在真的想，不要说"我会努力""我明白了""你说得对"等收尾的话，结尾可以是一个悬而未决的问题，或一个刚刚浮现的新裂缝）",
  "ending": { "trigger": false, "type": "normal", "reason": "" }
}

注意：只输出JSON，不要其他内容`;
        console.log("========== 反思页完整Prompt ==========");
        console.log(prompt);
        console.log("====================================");

        // 一次性调用 API 获取完整响应
        setIsLoading(false);
        const responseText = await callAPI(prompt);
        console.log("最终反思原始文本:", responseText);

        // 解析 JSON 返回值（不需要 backgroundImage）
        const parsed = safeParseJSON(responseText, {
          reflection: getRandomReflection(),
          ending: { trigger: false, type: "normal", reason: "" },
        });

        console.log("解析后的反思:", parsed.reflection);
        console.log("解析后的结局:", parsed.ending);

        // 显示反思文本并保存到对话历史
        setReflectionText(parsed.reflection);
        updateConversationWithReflection(parsed.reflection);

        // 保存结局触发到store
        if (parsed.ending) {
          setReflectionEnding({
            trigger: parsed.ending.trigger || false,
            type: (parsed.ending.type as any) || null,
            reason: parsed.ending.reason || "",
          });
        }
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
          <LobsterSprite age={lobster.age} stage={lobster.stage} action="idle" size={80} />
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
    <div
      className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: backgroundImage
          ? `url('${backgroundImage}')`
          : undefined,
      }}
    >
      {/* 状态栏 */}
      <div className="h-[62px]"></div>

      {/* 主内容区 - 自然流式布局，按钮跟随内容弹性伸缩 */}
      <div className="flex flex-col items-center gap-4 px-6 pb-6">
        {/* 标题和龙虾 */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs text-[#71717a]">{lobster.name}想了想...</p>
          <LobsterSprite age={lobster.age} stage={lobster.stage} action="idle" size={80} />
        </div>

        {/* 反思文本容器 - 平行四边形背景 */}
        <div className="w-full px-6">
          <div className="bg-white/25 -skew-x-6 p-6 flex flex-col gap-3 drop-shadow-xl min-h-[80px]">
            <TypewriterText
              text={reflectionText}
              speed={50}
              className="text-base text-[#18181b] text-center leading-relaxed whitespace-pre-line block"
            />
          </div>
        </div>

        {/* 按钮区域 - 自然流式布局 */}
        <div className="flex flex-col gap-2 pt-4 w-full">
          <button
            onClick={() => {
              // 最高优先级：检查AI触发的结局（lost/shattered）
              if (checkAIEnding()) {
                console.log("[结局] 检测到AI触发结局，跳转到结局页");
                navigate("/result");
                return;
              }

              // 检查强制法人
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
            className="w-full py-3 bg-white/15 -skew-x-6 text-[#18181b] text-base font-medium shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:bg-white/25 transition-colors"
          >
            <span className="block skew-x-6">继续陪伴</span>
          </button>
          <p className="text-xs text-[#71717a] text-center">
            {getBottomHint()}
          </p>
        </div>
      </div>
    </div>
  );
}
