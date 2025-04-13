'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';

// 添加API基础URL
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://your-railway-app.railway.app';

export default function PaperGenerator() {
  const [researchTopic, setResearchTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [latexContent, setLatexContent] = useState('');
  const [paperTitle, setPaperTitle] = useState('');
  const [language, setLanguage] = useState('english');
  const [isEditMode, setIsEditMode] = useState(true);
  const fileDownloadRef = useRef<HTMLAnchorElement>(null);

  // 生成论文
  const generatePaper = async () => {
    // if (!researchTopic.trim()) return; // 如果之前有基于 user 的检查，也可能需要调整
    setIsGenerating(true);
    try {
      // --- START: 删除这部分后端调用 ---
      /* 
      // 记录查询到数据库 - 这部分代码需要删除或注释掉
      await fetch(`${API_BASE_URL}/api/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'user@example.com', // 或者其他用户标识
          topic: researchTopic, // 使用正确的变量名
          content: researchTopic, // 使用正确的变量名
          type: 'paper'
        })
      });
      */
      // --- END: 删除这部分后端调用 ---

      // --- 保留原来直接调用 Gemini API 生成论文的逻辑 ---
      const API_KEY = 'AIzaSyDy9pYAEW7e2Ewk__9TCHAD5X_G1VhCtVw'; // 确保 API Key 安全
      const MODEL = 'gemini-2.0-flash-latest';
      const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
      
      // 生成 prompt
      const prompt = generatePrompt(researchTopic, language);
      
      // 直接发送请求
      const response = await fetch(GEMINI_API_URL, {
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
            temperature: 0.3,
            topP: 0.8,
            topK: 40,
            maxOutputTokens: 8192,
          }
        })
      });
      
      if (!response.ok) {
        // 确保这里的错误处理只针对 Gemini API 调用
        // throw new Error('生成失败'); // 保持这个错误处理
        // 注意：之前的 TypeError: Load failed 可能是因为 fetch 到后端失败导致的，删除后端调用后这个特定的 TypeError 应该会消失
        throw new Error(`Gemini API 响应错误: ${response.status}`);
      }
      
      const data = await response.json();
      
      // 从生成文本中提取 LaTeX 内容和标题
      const generatedText = data.candidates[0].content.parts[0].text;
      const { title, latex } = extractLatexContent(generatedText, researchTopic);
      
      setPaperTitle(title);
      setLatexContent(latex);
    } catch (error) {
      console.error('生成论文失败:', error);
      alert('生成论文时出错，请稍后重试');
    } finally {
      setIsGenerating(false);
    }
  };

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

  // 下载LaTeX文件
  const downloadLatex = () => {
    if (!latexContent) return;
    
    const blob = new Blob([latexContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    if (fileDownloadRef.current) {
      fileDownloadRef.current.href = url;
      fileDownloadRef.current.download = `${paperTitle.replace(/\s+/g, '_').toLowerCase()}.tex`;
      fileDownloadRef.current.click();
    }
    
    URL.revokeObjectURL(url);
  };

  // 生成针对 Gemini 模型优化的 prompt
  function generatePrompt(topic: string, language: string) {
    const isEnglish = language.toLowerCase() === 'english';
    
    return isEnglish ? 
      `You are a leading researcher and professor in the field of ${topic} with numerous publications in top journals. Create a complete, innovative IEEE-formatted LaTeX paper on "${topic}" that demonstrates original thinking and novel approaches.

REQUIREMENTS:
1. The paper MUST be comprehensive (15-20 pages when compiled) with significant technical depth
2. Format for IEEE conference with proper structure:
   - Title (creative, specific, and attention-grabbing)
   - Author information (Use "ResearchGPT AI Research Team")
   - Abstract (concise overview highlighting novelty)
   - Keywords (5-7 relevant keywords)
   - Introduction (problem context, motivation, and significance)
   - Literature Review/Background (thorough analysis of existing work)
   - Methodology (detailed, innovative approach with justifications)
   - Mathematical Framework (include at least 4-5 non-trivial equations with explanations)
   - Experimental Setup (comprehensive description of data/parameters)
   - Results Analysis (detailed discussion with comparative analysis)
   - Discussion (implications, limitations, theoretical contributions)
   - Conclusion (summarize contributions and future work)
   - References (15+ realistic, recent references with proper IEEE formatting)

3. CRITICAL REQUIREMENTS:
   - Content must be ORIGINAL and INNOVATIVE - propose new methods or frameworks
   - Include at least 2 complex diagrams described in LaTeX (using tikz or similar)
   - Add detailed tables with realistic data
   - Use proper academic language and specialized terminology
   - Incorporate mathematical notation extensively (equations, theorems, lemmas)
   - Provide substantive analysis that demonstrates expert knowledge
   - Ensure logical flow between sections with proper transitions

4. FORMAT REQUIREMENTS:
   - Use proper LaTeX commands and IEEE template elements
   - Include \\cite{} commands throughout the text
   - Structure document with appropriate sectioning
   - Format must be complete and compilable

OUTPUT FORMAT: Provide ONLY the complete LaTeX code without any explanations or comments about the code itself. Start with \\documentclass and end with \\end{document}.` 
      : 
      `你是${topic}领域的顶尖研究者和教授，在顶级期刊发表过多篇论文。请创建一篇完整、创新的IEEE格式LaTeX论文，主题是"${topic}"，展示原创思维和新颖方法。

要求:
1. 论文必须全面（编译后15-20页）且具有显著的技术深度
2. 按IEEE会议格式构建，结构包括:
   - 标题（创意性强、具体且吸引人）
   - 作者信息（使用"ResearchGPT AI研究团队"）
   - 摘要（简明概述，突出创新点）
   - 关键词（5-7个相关关键词）
   - 引言（问题背景、研究动机和重要性）
   - 文献综述/背景（现有工作的全面分析）
   - 方法论（详细、创新的方法及其合理性）
   - 数学框架（至少包含4-5个非平凡方程及解释）
   - 实验设置（数据/参数的全面描述）
   - 结果分析（详细讨论并进行比较分析）
   - 讨论（影响、局限性、理论贡献）
   - 结论（总结贡献和未来工作）
   - 参考文献（15+个真实、近期参考文献，使用IEEE格式）

3. 关键要求:
   - 内容必须原创且创新 - 提出新方法或框架
   - 包含至少2个用LaTeX描述的复杂图表（使用tikz或类似工具）
   - 添加包含真实数据的详细表格
   - 使用适当的学术语言和专业术语
   - 广泛使用数学符号（方程式、定理、引理）
   - 提供展示专业知识的实质性分析
   - 确保各部分之间逻辑流畅，有适当过渡

4. 格式要求:
   - 使用正确的LaTeX命令和IEEE模板元素
   - 在整个文本中包含\\cite{}命令
   - 使用适当的分节结构化文档
   - 格式必须完整且可编译

输出格式：只提供完整的LaTeX代码，不要包含关于代码本身的任何解释或评论。从\\documentclass开始，到\\end{document}结束。`;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* 头部导航 */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600 flex items-center">
            <svg className="w-8 h-8 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
            <Link href="/">ResearchGPT</Link>
          </h1>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link href="/" className="hover:text-blue-500">首页</Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-blue-500">研究探索</Link>
              </li>
              <li>
                <Link href="/paper" className="hover:text-blue-500 text-blue-600 font-medium">AI论文生成</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-500">关于</Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3 fancy-title">AI 论文生成器</h2>
            <p className="text-lg text-gray-600">
              输入研究主题，自动生成高质量的学术论文（IEEE格式）- Powered by Gemini
            </p>
          </div>

          {/* 输入区域 */}
          <div className="mb-8 bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  value={researchTopic}
                  onChange={(e) => setResearchTopic(e.target.value)}
                  placeholder="输入研究主题，例如：人工智能、机器学习、量子计算..."
                  className="flex-grow px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isGenerating}
                />
                
                {/* 语言选择下拉菜单 */}
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  disabled={isGenerating}
                >
                  <option value="english">英文论文</option>
                  <option value="chinese">中文论文</option>
                </select>
                
                <button
                  onClick={generatePaper}
                  disabled={isGenerating || !researchTopic.trim()}
                  className={`px-6 py-3 rounded-lg whitespace-nowrap ${
                    isGenerating || !researchTopic.trim()
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'gradient-button'
                  } text-white font-medium`}
                >
                  {isGenerating ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      AI生成中...
                    </span>
                  ) : (
                    '生成论文'
                  )}
                </button>
              </div>
              
              <p className="text-sm text-gray-500 text-center">
                由 Google Gemini提供支持，生成高质量 LaTeX 格式论文（5-6页篇幅）
              </p>
            </div>
          </div>

          {/* 论文内容区域 */}
          {latexContent && (
            <div className="mb-8 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-blue-700">{paperTitle}</h3>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setIsEditMode(!isEditMode)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-800 transition-colors duration-300"
                  >
                    {isEditMode ? '查看原始代码' : '编辑模式'}
                  </button>
                  <button
                    onClick={downloadLatex}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white transition-colors duration-300 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                    </svg>
                    下载LaTeX文件
                  </button>
                </div>
              </div>

              <div className="bg-white border rounded-lg shadow-inner">
                {isEditMode ? (
                  <textarea
                    value={latexContent}
                    onChange={(e) => setLatexContent(e.target.value)}
                    className="w-full h-[70vh] p-4 font-mono text-sm focus:outline-none resize-none border-0 bg-gray-50 rounded-lg"
                  />
                ) : (
                  <pre className="w-full h-[70vh] p-4 font-mono text-sm overflow-auto whitespace-pre-wrap bg-gray-50 rounded-lg">
                    {latexContent}
                  </pre>
                )}
              </div>
              
              <div className="mt-4 text-sm text-gray-500 bg-blue-50 p-4 rounded-lg">
                <p className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  提示：您可以下载此LaTeX文件并使用<a href="https://www.overleaf.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Overleaf</a>等在线LaTeX编辑器进行编译和微调。
                </p>
              </div>

              <div className="mt-4 bg-blue-50 p-4 rounded-lg flex items-start">
                <svg className="w-6 h-6 text-blue-500 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm text-gray-700">
                    您可以使用 <a href="https://www.overleaf.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Overleaf</a> 在线编辑器打开下载的 LaTeX 文件。Overleaf 提供实时预览和协作功能，是编辑 LaTeX 文档的理想选择。
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 底部 */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">ResearchGPT</h3>
              <p className="text-gray-300">智能研究助手</p>
            </div>
            <div>
              <p>© {new Date().getFullYear()} ResearchGPT. 保留所有权利。</p>
            </div>
          </div>
        </div>
      </footer>
      
      {/* 隐藏的下载链接 */}
      <a ref={fileDownloadRef} style={{ display: 'none' }} />
    </div>
  );
} 