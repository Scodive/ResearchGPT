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
    const { topic, language = 'english' } = req.body;
    
    if (!topic || typeof topic !== 'string') {
      return res.status(400).json({ message: '请提供有效的研究主题' });
    }
    
    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
      console.error('未设置 GEMINI_API_KEY 环境变量');
      return res.status(500).json({ message: 'API 密钥未配置' });
    }
    const MODEL = 'gemini-1.5-flash-latest'; // 更新为最新的 API 版本和模型
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
    
    res.status(200).json({ title, latex });
  } catch (error) {
    console.error('Gemini API 调用失败:', error);
    res.status(500).json({ 
      message: '生成论文失败',
      error: String(error),
      hint: '可能是 API 限制或网络问题，请稍后重试'
    });
  }
}

// 生成针对 Gemini 模型优化的 prompt
function generatePrompt(topic: string, language: string) {
  const isEnglish = language.toLowerCase() === 'english';
  
  return isEnglish ? 
    `You are an expert academic researcher with extensive knowledge in ${topic} and academic writing. Please generate a complete IEEE-formatted LaTeX paper about "${topic}".

REQUIREMENTS:
1. The paper should be formatted for an IEEE conference
2. Include the following sections:
   - Title (creative and descriptive for ${topic})
   - Author information (Use "ResearchGPT" as author)
   - Abstract
   - Keywords
   - Introduction
   - Background/Related Work
   - Methodology
   - Results/Findings
   - Discussion
   - Conclusion
   - References (at least 8 realistic, recent references)
3. Include proper LaTeX formatting with IEEE template
4. Add several mathematical equations where appropriate
5. Ensure the content is academically rigorous, detailed and insightful
6. Use proper IEEE citation format with \\cite{} commands
7. The paper should be approximately 5-6 pages when compiled

IMPORTANT: Provide ONLY the complete LaTeX code without any explanations. Start with \\documentclass and end with \\end{document}.` 
    : 
    `你是一位在${topic}领域具有丰富知识和学术写作经验的专家研究员。请生成一篇完整的IEEE格式LaTeX论文，主题是"${topic}"。

要求:
1. 论文应采用IEEE会议格式
2. 包含以下部分:
   - 标题（创意且能描述${topic}的核心内容）
   - 作者信息（使用"ResearchGPT"作为作者）
   - 摘要
   - 关键词
   - 引言
   - 背景/相关工作
   - 方法论
   - 结果/发现
   - 讨论
   - 结论
   - 参考文献（至少8个真实、近期的参考文献）
3. 使用正确的LaTeX格式和IEEE模板
4. 在适当位置添加数学公式
5. 确保内容学术严谨、详细且有见解
6. 使用IEEE引用格式，包含\\cite{}命令
7. 编译后的论文应约为5-6页

重要：只提供完整的LaTeX代码，不要有任何解释。从\\documentclass开始，以\\end{document}结束。`;
}

// 从生成文本中提取LaTeX内容和标题
function extractLatexContent(text: string, topic: string) {
  // 删除markdown代码块标记（如果有）
  const cleanedText = text.replace(/```latex\n/g, '').replace(/```\n?/g, '');
  
  // 尝试从LaTeX中提取标题
  const titleMatch = cleanedText.match(/\\title\{([^}]+)\}/);
  const title = titleMatch ? titleMatch[1] : `Advanced Research on ${topic}`;
  
  return {
    title,
    latex: cleanedText.trim()
  };
} 