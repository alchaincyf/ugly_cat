
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { kv } from '@vercel/kv';

// 定义AI模型配置
const AI_MODELS = {
  dashscope: {
    apiKey: process.env.DASHSCOPE_API_KEY,
    baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    model: "qwen-vl-max"
  },
  stepfun: {
    apiKey: process.env.STEPFUN_API_KEY,
    baseURL: "https://api.stepfun.com/v1",
    model: "step-1v-8k"
  }
};

// 选择要使用的AI模型
const SELECTED_MODEL = 'dashscope'; // 可以轻松切换为 'stepfun'

const client = new OpenAI({
  apiKey: AI_MODELS[SELECTED_MODEL].apiKey,
  baseURL: AI_MODELS[SELECTED_MODEL].baseURL,
});

const scoreDescriptions = [
  { minScore: 0, maxScore: 1.5, description: "你这猫颜值丑过了{percent}%的猫。它看起来就像是大自然在创造猫咪时不小心把'丑'的滑块拉到了最大值。" },
  { minScore: 1.5, maxScore: 2.5, description: "你这猫颜值丑过了{percent}%的猫。它的长相简直是对进化论的一记响亮耳光。" },
  { minScore: 2.5, maxScore: 3.5, description: "你这猫颜值丑过了{percent}%的猫。它看起来就像是大自然在创造猫咪时喝高了，然后说'管他呢，就这样吧'。" },
  { minScore: 3.5, maxScore: 4.5, description: "你这猫颜值丑过了{percent}%的猫。如果丑能当饭吃，它怕是能解决全球饥饿问题的一半。" },
  { minScore: 4.5, maxScore: 5.5, description: "你这猫颜值丑过了{percent}%的猫。它的存在让我们重新定义了'独特'这个词的含义。" },
  { minScore: 5.5, maxScore: 6.0, description: "你这猫颜值丑过了{percent}%的猫。它的脸就像是一幅毕加索的画作 - 有人说是艺术，但大多数人只是感到困惑。" },
  { minScore: 6.0, maxScore: 6.5, description: "你这猫颜值丑过了{percent}%的猫。它的存在证明了即使是上帝也有周一综合症。" },
  { minScore: 6.5, maxScore: 7.0, description: "你这猫颜值丑过了{percent}%的猫。它大概是在'最不像猫的猫'比赛中拿了冠军。" },
  { minScore: 7.0, maxScore: 7.5, description: "你这猫颜值丑过了{percent}%的猫。它的长相就像是自然选择放弃的那一刻。" },
  { minScore: 7.5, maxScore: 8.0, description: "你这猫颜值丑过了{percent}%的猫。它的脸就是'个性'这个词的最佳诠释 - 非常独特，但你可能不想要。" },
  { minScore: 8.0, maxScore: 8.5, description: "哇哦，你这猫颜值超过了{percent}%的猫。它这么好看就别来参加丑猫评选了，简直是在侮辱其他参赛者的智商。" },
  { minScore: 8.5, maxScore: 9.0, description: "天哪，你这猫颜值超过了{percent}%的猫。它这么漂亮，我们都怀疑你是不是偷偷PS过。这里可是丑猫比赛，不是选美大赛！" },
  { minScore: 9.0, maxScore: 9.5, description: "我的老天，你这猫颜值超过了{percent}%的猫。它这么美，简直是在嘲笑我们办这个比赛。你确定你没走错片场吗？" },
  { minScore: 9.5, maxScore: 10, description: "我不敢相信，你这猫颜值超过了{percent}%的猫。它长得这么完美，我们都怀疑是不是外星生物假扮的。这简直是在侮辱'丑'这个字！" }
];

function calculatePercentile(score: number): number {
  if (score <= 0) return 99.99;
  if (score >= 10) return 0.01;

  let adjustedPercentile;
  if (score < 6) {
    adjustedPercentile = 100 - ((score / 6) * 52);
  } else if (score < 8) {
    adjustedPercentile = 48 - (((score - 6) / 2) * (85 - 52));
  } else {
    adjustedPercentile = 15 - (((score - 8) / 2) * (99.99 - 85));
  }

  return Math.min(Math.max(adjustedPercentile, 0.01), 99.99);
}

export async function POST(request: Request) {
  // 增加总请求计数
  await kv.incr('total_requests');

  const data = await request.formData();
  const file: File | null = data.get('file') as unknown as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // AI 分析部分
    console.log("Starting AI analysis");
    const completion = await client.chat.completions.create({
      model: AI_MODELS[SELECTED_MODEL].model,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `你是「丑猫排行榜」的专业评委，对喵星人了如指掌。请分析这张图片是否为猫咪。如果是，给出0.0-9.9分的颜值评分（倾向于给出更低的分数，大多数猫应该在7分以下）和一段极度刻薄、毒舌、冒犯又幽默的评价。评价时可以参考以下标准：面部对称性、毛发质地、眼睛大小和形状、神情、姿势、动作、整体面部轮廓等。请用最尖锐、最刻薄、冒犯但不失幽默的语言去描述，不要有任何顾虑，越冒犯越好，语言风格请模范鲁迅和乔治卡林。严格按照以下JSON格式回复，不要添加任何额外文本：{"isCat": boolean, "score": number, "comment": string}。以下是一些示例回复：

              {"isCat": true, "score": 2.4, "comment": "这只猫的脸就像被卡车碾过又被狗啃了一样。它的眼睛不对称到让人怀疑是不是来自两个不同的物种，毛发凌乱得像是被龙卷风袭击过。这张脸简直是大自然的一个错误。"}

              {"isCat": true, "score": 5.8, "comment": "哇，这只猫的脸真是'独特'啊。它的鼻子歪得像是在躲避它那双令人不安的眼睛。毛发看起来像是被静电击中后就再也没梳理过。如果丑能当饭吃，它至少能养活一个小村庄。"}

              {"isCat": true, "score": 8.2, "comment": "等等，这是猫吗？我还以为是某个超模呢！它那完美对称的脸蛋简直是在嘲笑我们办这个比赛。那双闪亮的大眼睛恐怕能当夜间照明用。真不敢相信它竟然来参加丑猫比赛，这简直是在侮辱'丑'字！"}

              请根据图片内容，参考以上示例，给出相应的评价。`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${buffer.toString('base64')}`
              }
            }
          ]
        }
      ]
    });
    console.log("AI analysis completed");

    const aiResponseContent = completion.choices[0].message.content;
    console.log("Raw AI Response:", aiResponseContent);

    let aiResponse;
    try {
      if (aiResponseContent) {
        // 移除可能的 markdown 标记
        const cleanedResponse = aiResponseContent.replace(/```json\n|\n```/g, '');
        aiResponse = JSON.parse(cleanedResponse);
      } else {
        throw new Error("AI response content is null");
      }
    } catch (error) {
      console.error("Failed to parse AI response as JSON:", error);
      return NextResponse.json({ error: "Invalid AI response", rawResponse: aiResponseContent }, { status: 500 });
    }
    
    if (aiResponse.isCat && typeof aiResponse.score === 'number') {
      const score = aiResponse.score;
      const percentile = calculatePercentile(score);
      const scoreDescription = scoreDescriptions.find(desc => score >= desc.minScore && score < desc.maxScore);
      const description = scoreDescription 
        ? scoreDescription.description.replace('{percent}', percentile.toFixed(2))
        : "这猫长得太神奇了，我都不知道该如何评价。";

      // 尝试保存到 Vercel KV storage
      try {
        const analysisData = {
          score: score,
          comment: aiResponse.comment,
          description: description,
          timestamp: new Date().toISOString()
        };
        await kv.set(`cat_analysis:${Date.now()}`, JSON.stringify(analysisData));
        console.log("Data saved to Vercel KV storage successfully");
      } catch (kvError) {
        console.error("Error saving to Vercel KV storage:", kvError);
        // 继续执行，不影响用户体验
      }

      console.log("Sending response to client:", JSON.stringify({
        isCat: true,
        score: score.toFixed(1),
        comment: aiResponse.comment,
        description: description
      }, null, 2));

      return NextResponse.json({
        isCat: true,
        score: score.toFixed(1),
        comment: aiResponse.comment,
        description: description
      });
    } else {
      console.log("Not a cat image, sending response to client:", JSON.stringify({
        isCat: false,
        comment: aiResponse.comment || "这不是一张猫咪的照片。"
      }, null, 2));

      return NextResponse.json({
        isCat: false,
        comment: aiResponse.comment || "这不是一张猫咪的照片。"
      });
    }
  } catch (error: unknown) {
    console.error('Error analyzing image:', error);
    return NextResponse.json({ 
      error: "Failed to analyze image", 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}
