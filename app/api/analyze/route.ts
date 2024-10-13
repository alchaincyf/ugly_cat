import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { db, storage } from '../../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';

const client = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY,
  baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
});

const scoreDescriptions = [
  { minScore: 0, maxScore: 3.5, description: "你这猫颜值丑过了{percent}%的猫，堪称猫界的艺术品，如果艺术的定义是让人产生强烈的情感反应的话。" },
  { minScore: 3.5, maxScore: 5.5, description: "你这猫颜值丑过了{percent}%的猫，就像是大自然的一个错误，证明了进化论也会偶尔打瞌睡。" },
  { minScore: 5.5, maxScore: 6.0, description: "你这猫颜值丑过了{percent}%的猫，看起来像是被上帝用剩下的零件拼凑而成的，还是在周一早上宿醉未醒的时候。" },
  { minScore: 6.0, maxScore: 6.5, description: "你这猫颜值丑过了{percent}%的猫，如果丑能当饭吃，它怕是能养活整个非洲。" },
  { minScore: 6.5, maxScore: 7.0, description: "你这猫颜值丑过了{percent}%的猫，看来'貌不惊人'这个成语是为它量身定制的。" },
  { minScore: 7.0, maxScore: 7.5, description: "你这猫颜值丑过了{percent}%的猫，大概是上辈子造了孽，这辈子才长成这样。" },
  { minScore: 7.5, maxScore: 8.0, description: "你这猫颜值丑过了{percent}%的猫，看来'丑得别具一格'这个词是为它发明的。" },
  { minScore: 8.0, maxScore: 8.5, description: "你这猫颜值丑过了{percent}%的猫，如果说美丽需要勇气，那它一定是最勇敢的猫了。" },
  { minScore: 8.5, maxScore: 9.0, description: "你这猫颜值丑过了{percent}%的猫，它的存在证明了即使是大自然也会犯错。" },
  { minScore: 9.0, maxScore: 9.5, description: "你这猫颜值丑过了{percent}%的猫，它的脸就像是一幅抽象画，让人看了就想问：这是猫吗？" },
  { minScore: 9.5, maxScore: 10, description: "你这猫颜值丑过了{percent}%的猫，它的存在让我相信了平行宇宙的存在，因为在正常宇宙里不可能有这么丑的猫。" }
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
  const data = await request.formData();
  const file: File | null = data.get('file') as unknown as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');

    let imageUrl = '';
    try {
      console.log("Attempting to upload image to Firebase Storage");
      const storageRef = ref(storage, `cat_images/${Date.now()}.jpg`);
      await uploadString(storageRef, base64Image, 'base64', { contentType: 'image/jpeg' });
      console.log("Image uploaded successfully");
      imageUrl = await getDownloadURL(storageRef);
      console.log("Image URL retrieved:", imageUrl);
    } catch (uploadError) {
      console.error("Error uploading to Firebase Storage:", uploadError);
      // 继续执行，即使上传失败
    }

    // AI 分析部分
    const completion = await client.chat.completions.create({
      model: "qwen-vl-max",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "分析这张图片是否为猫咪。如果是，给出0.0-8.0分的颜值评分和一段刻薄、毒辣但又幽默的评价，风格类似鲁迅或乔治·卡林。请严格按照以下JSON格式回复，不要添加任何额外文本：{\"isCat\": boolean, \"score\": number, \"comment\": string}"
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ]
    });

    const aiResponseContent = completion.choices[0].message.content;
    console.log("Raw AI Response:", aiResponseContent);

    let aiResponse;
    try {
      // 移除可能的 markdown 标记
      const cleanedResponse = aiResponseContent.replace(/```json\n|\n```/g, '');
      aiResponse = JSON.parse(cleanedResponse);
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

      try {
        if (imageUrl) {
          console.log("Attempting to save data to Firestore");
          await addDoc(collection(db, "cat_analyses"), {
            imageUrl: imageUrl,
            score: score,
            comment: aiResponse.comment,
            description: description,
            timestamp: new Date()
          });
          console.log("Data saved to Firestore successfully");
        }
      } catch (firestoreError) {
        console.error("Error saving to Firestore:", firestoreError);
        // 继续执行，即使 Firestore 保存失败
      }

      return NextResponse.json({
        isCat: true,
        score: score.toFixed(1),
        comment: aiResponse.comment,
        description: description
      });
    } else {
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