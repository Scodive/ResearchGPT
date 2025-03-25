import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const { topic, language = 'english' } = await request.json();
    
    if (!topic || typeof topic !== 'string') {
      return NextResponse.json({ message: '请提供有效的研究主题' }, { status: 400 });
    }
    
    const API_KEY = 'AIzaSyDy9pYAEW7e2Ewk__9TCHAD5X_G1VhCtVw'; // 实际应用中应从环境变量获取
    const MODEL = 'gemini-1.5-flash-latest'; // 更新为最新可用模型
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

    // 构建精心设计的 prompt
    const prompt = generatePrompt(topic, language);
    
    // 调用 Gemini API
    const response = await axios.post(API_URL, {
      contents: [
        {
          parts: [
            { text: prompt }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 8192,
      }
    });

    // 处理响应
    const generatedText = response.data.candidates[0].content.parts[0].text;
    
    // 从生成文本中提取 LaTeX 内容和标题
    const { title, latex } = extractLatexContent(generatedText, topic);
    
    return NextResponse.json({ title, latex });
  } catch (error: any) {
    console.error('Gemini API 调用失败:', error);
    return NextResponse.json({
      message: '生成论文失败',
      error: String(error),
      hint: '可能是 API 限制或网络问题，请稍后重试'
    }, { status: 500 });
  }
}

// 生成针对 Gemini 模型优化的 prompt
function generatePrompt(topic: string, language: string) {
  // ... 保持不变 ...
}

// 从生成文本中提取LaTeX内容和标题
function extractLatexContent(text: string, topic: string) {
  // ... 保持不变 ...
} 