import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '只支持POST请求' });
  }

  try {
    const { topic } = req.body;
    
    if (!topic || typeof topic !== 'string') {
      return res.status(400).json({ message: '请提供有效的研究主题' });
    }

    // 这里可以调用OpenAI API或其他LLM API
    // 示例：使用OpenAI API
    /*
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: '你是一个学术专家，能够生成高质量的LaTeX格式论文。'
          },
          {
            role: 'user',
            content: `请为我生成一篇关于"${topic}"的学术论文，使用IEEE会议格式的LaTeX代码。
                     包括标题、摘要、关键词、引言、背景、方法、结果、讨论和结论部分。
                     还应包含一些参考文献。`
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const title = `Advancements in ${topic}: A Comprehensive Review`;
    const latexContent = response.data.choices[0].message.content;
    */

    // 模拟响应
    const title = `Advancements in ${topic}: A Comprehensive Review`;
    const latexContent = generateSampleLatex(topic, title);
    
    res.status(200).json({ title, latex: latexContent });
  } catch (error) {
    console.error('论文生成错误:', error);
    res.status(500).json({ message: '生成论文失败', error: String(error) });
  }
}

// 生成示例LaTeX
function generateSampleLatex(topic: string, title: string) {
  // 这里粘贴前端中的generateSampleLatex函数内容
} 