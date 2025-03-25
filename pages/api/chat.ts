import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '只支持POST请求' });
  }

  try {
    const { message, context } = req.body;
    
    const API_KEY = process.env.GEMINI_API_KEY;
    const MODEL = 'gemini-1.5-flash-latest';
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
    
    // 构建prompt
    const prompt = `作为一个研究助手，请基于以下研究计划回答问题或提供建议：

研究主题：${context.title}
研究背景：${context.background}
研究目标：${context.objectives.join(', ')}
研究方法：${context.methodology}

用户问题/建议：${message}

请提供专业、具体且有建设性的回答。`;
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 1024,
        }
      })
    });
    
    if (!response.ok) {
      throw new Error(`API响应错误: ${response.status}`);
    }
    
    const data = await response.json();
    const reply = data.candidates[0].content.parts[0].text;
    
    res.status(200).json({ reply });
  } catch (error) {
    console.error('处理对话失败:', error);
    res.status(500).json({ message: '获取回复失败', error: String(error) });
  }
} 