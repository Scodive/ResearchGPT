'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

// 添加API基础URL
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://your-railway-app.railway.app';

export default function PaperGenerator() {
  const [researchTopic, setResearchTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [latexContent, setLatexContent] = useState('');
  const [paperTitle, setPaperTitle] = useState('');
  const [language, setLanguage] = useState('english');
  const [isEditMode, setIsEditMode] = useState(false);
  const fileDownloadRef = useRef<HTMLAnchorElement>(null);

  // State for cost estimation and animation
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null);
  const [displayCost, setDisplayCost] = useState<number>(0);
  const costIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationStartTimeRef = useRef<number | null>(null);

  // Effect to handle cost animation
  useEffect(() => {
    if (isGenerating && estimatedCost !== null) {
      animationStartTimeRef.current = Date.now();
      setDisplayCost(0);

      costIntervalRef.current = setInterval(() => {
        const now = Date.now();
        const elapsedTime = now - (animationStartTimeRef.current || now);
        const animationDuration = 2000;

        const progress = Math.min(elapsedTime / animationDuration, 1);

        const easedProgress = 1 - Math.pow(1 - progress, 3);
        setDisplayCost(easedProgress * estimatedCost);

        if (progress >= 1) {
          if (costIntervalRef.current) {
            clearInterval(costIntervalRef.current);
            costIntervalRef.current = null;
          }
          setDisplayCost(estimatedCost);
        }
      }, 30);

    } else {
      if (costIntervalRef.current) {
        clearInterval(costIntervalRef.current);
        costIntervalRef.current = null;
        if (estimatedCost !== null) {
            setDisplayCost(estimatedCost);
        }
      }
    }

    return () => {
      if (costIntervalRef.current) {
        clearInterval(costIntervalRef.current);
        costIntervalRef.current = null;
      }
    };
  }, [isGenerating, estimatedCost]);

  // 生成论文
  const generatePaper = async () => {
    setIsGenerating(true);
    setLatexContent('');
    setPaperTitle('');
    setEstimatedCost(null);
    setDisplayCost(0);

    const randomCost = Math.random() * 0.6 + 0.2;
    setEstimatedCost(randomCost);

    try {
      const API_KEY = 'AIzaSyDy9pYAEW7e2Ewk__9TCHAD5X_G1VhCtVw';
      const MODEL = 'gemini-2.0-flash-exp';
      const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

      const prompt = generatePrompt(researchTopic, language);

      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.4, topP: 0.8, topK: 40, maxOutputTokens: 8192 }
        })
      });

      if (!response.ok) {
         throw new Error(`Gemini API 响应错误: ${response.status}`);
      }

      const data = await response.json();
      if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content?.parts?.[0]?.text) {
          throw new Error('API 返回了无效的响应结构');
      }
      const generatedText = data.candidates[0].content.parts[0].text;
      const { title, latex } = extractLatexContent(generatedText, researchTopic);

      setPaperTitle(title);
      setLatexContent(latex);

    } catch (error) {
      console.error('生成论文失败:', error);
      alert(`生成论文时出错: ${error.message}`);
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
    
    // Keep the English prompt as it is
    const englishPrompt = `You are a leading researcher and professor in the field of ${topic} with numerous publications in top journals. Create a complete, innovative IEEE-formatted LaTeX paper on "${topic}" that demonstrates original thinking and novel approaches.

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

OUTPUT FORMAT: Provide ONLY the complete LaTeX code without any explanations or comments about the code itself. Start with \\documentclass and end with \\end{document}.`; 
      
    // --- START: Modify the Chinese Prompt Significantly ---
    const chinesePrompt = `
你是一位在"${topic}"领域内，拥有多篇顶级期刊发表经验的顶尖研究员和教授。请围绕主题"${topic}"，创作一篇完整、创新、具有深度、并且严格符合 IEEE 会议格式的 LaTeX 学术论文。

**强制性要求：**
1.  **语言：** 整篇论文的**所有**内容，包括标题、作者信息、摘要、关键词、所有章节标题、正文内容、图表标题、参考文献等，**必须全部使用简体中文**书写。不得包含任何英文（除非是公认的英文缩写或特定术语，但应尽可能少用）。
2.  **内容原创性与深度：** 论文必须体现原创思考和新颖的研究方法或视角。内容需要全面（编译后期望达到10-15页），并展现出显著的技术深度和专业性。严禁简单重复已知信息。
3.  **IEEE 格式与结构：** 严格遵循 IEEE 会议论文格式，包含以下标准部分：
    *   \`\\\\title{}\`: 一个具体、有深度且吸引人的中文标题。
    *   \`\\\\author{}\`: 作者信息固定为"ResearchGPT AI 研究团队"。
    *   \`\\\\begin{abstract}\`...\`\\\\end{abstract}\`: 简洁明了的中文摘要，明确突出论文的创新点和主要贡献。
    *   \`\\\\begin{IEEEkeywords}\`...\`\\\\end{IEEEkeywords}\`: 5-7个高度相关的中文关键词。
    *   \`\\\\section{引言}\`: 清晰阐述研究背景、问题、动机、研究的重要性和论文的主要贡献概述。
    *   \`\\\\section{相关工作}\` 或 \`\\\\section{文献综述}\`: 对现有相关研究进行全面且批判性的中文分析，明确指出当前研究的不足之处。
    *   \`\\\\section{研究方法}\` 或 \`\\\\section{模型设计}\`: 详细阐述本文提出的创新方法、模型或框架，需要有充分的细节和 обоснование (理由陈述)。
    *   \`\\\\section{数学基础}\` 或 \`\\\\section{理论分析}\` (可选但推荐): 如果适用，包含严谨的数学推导或理论分析，至少包含3-4个带有详细中文解释的非平凡数学公式。
    *   \`\\\\section{实验设置}\`: 详细描述实验所用的数据集、评价指标、参数设置、对比方法等。
    *   \`\\\\section{实验结果与分析}\`: 展示清晰的实验结果（可以使用\`\\\\begin{table}\`和\`\\\\begin{figure}\`，图表标题和内容必须是中文），并进行深入、细致的中文分析和讨论，与相关工作进行比较。
    *   \`\\\\section{讨论}\` (可选): 讨论研究的意义、潜在应用、局限性以及对领域的理论贡献。
    *   \`\\\\section{结论与未来工作}\`: 总结论文的核心贡献，并指出未来值得探索的研究方向。
    *   \`\\\\bibliography{}\` 和 \`\\\\bibliographystyle{IEEEtran}\`: 包含至少15条格式规范（最好是中文或中英混合，但条目本身按IEEE格式）的相关参考文献列表，并在正文中使用 \`\\\\cite{}\` 标记进行引用。
4.  **技术细节要求：**
    *   如果论文内容适合，**必须**包含至少一个使用 LaTeX (例如 TikZ, PGFPlots) 绘制的复杂图表或流程图，所有标签和说明文字使用中文。
    *   **必须**包含至少一个包含具体数据的表格 (\`\\\\begin{table}\`)，所有标签和说明文字使用中文。
    *   **必须**使用严谨、规范的中文学术语言和相关领域的专业术语。
    *   在方法论或分析部分，合理地穿插使用数学符号和公式。
5.  **LaTeX 格式要求：**
    *   提供完整、无误、可以直接编译的 LaTeX 代码。
    *   使用标准的 LaTeX 命令和 IEEE 模板所需的宏包 (例如 \`\\\\documentclass[conference]{IEEEtran}\`, \`amsmath\`, \`graphicx\`, \`\\\\cite{}\` 等)。
    *   确保文档结构清晰，章节编号正确。

**输出格式：**
请**只**输出完整的 LaTeX 源代码文本，从 \`\\\\documentclass\` 开始，到 \`\\\\end{document}\` 结束。不要在代码前后或代码中添加任何额外的解释、评论、说明性文字或 markdown 标记（如 \\\`\\\`\\\`latex）。
`;
    // --- END: Modify the Chinese Prompt Significantly ---
    
    return isEnglish ? englishPrompt : chinesePrompt;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* 头部导航 */}
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
        <div className="container mx-auto py-4 px-6 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors duration-200">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
            <span className="text-2xl font-bold">ResearchGPT</span>
          </Link>
          <nav>
            <ul className="flex space-x-4 md:space-x-6 items-center">
              <li><Link href="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-100">首页</Link></li>
              <li><Link href="/search" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-100">研究探索</Link></li>
              <li><Link href="/paper" className="px-3 py-2 rounded-md text-sm font-medium text-blue-600 bg-blue-50">AI论文生成</Link></li>
              <li><Link href="/about" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-100">关于</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="flex-grow container mx-auto py-16 md:py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900 fancy-title">AI 论文生成器</h2>
            <p className="text-lg text-gray-600">
              输入研究主题，选择语言，即可生成高质量的 LaTeX 格式学术论文初稿。
            </p>
          </div>

          {/* 输入区域 */}
          <div className="mb-10 bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100">
            <div className="flex flex-col space-y-5">
              <label htmlFor="topic-input" className="block text-sm font-medium text-gray-700 sr-only">研究主题</label>
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <input
                  id="topic-input"
                  type="text"
                  value={researchTopic}
                  onChange={(e) => setResearchTopic(e.target.value)}
                  placeholder="输入具体的研究主题，例如：基于深度学习的图像识别新方法..."
                  className="flex-grow px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                  disabled={isGenerating}
                />

                <div className="flex space-x-4 w-full md:w-auto">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="flex-1 md:w-auto px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-base appearance-none"
                    disabled={isGenerating}
                    aria-label="选择论文语言"
                  >
                    <option value="english">English Paper</option>
                    <option value="chinese">中文论文</option>
                  </select>

                  <button
                    onClick={generatePaper}
                    disabled={isGenerating || !researchTopic.trim()}
                    className={`px-6 py-3 rounded-lg whitespace-nowrap ${
                      isGenerating || !researchTopic.trim()
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'gradient-button hover:opacity-90'
                    } text-white font-semibold text-base flex items-center justify-center transition-opacity duration-200`}
                  >
                    {isGenerating ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        生成中...
                      </>
                    ) : (
                      '✨ 生成论文'
                    )}
                  </button>
                </div>
              </div>

              {/* --- START: Modified Cost/Sponsorship Display --- */}
              {estimatedCost !== null ? (
                <div className={`mt-4 text-center p-4 border rounded-lg ${isGenerating ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'}`}>
                  <p className={`text-sm font-medium mb-2 ${isGenerating ? 'text-yellow-800' : 'text-green-800'}`}>
                    {isGenerating ? '🚀 AI 正在努力创作中...' : '✅ 生成完成!'} 预计资源消耗: $
                    <span className={`inline-block w-16 text-left font-mono font-semibold ${isGenerating ? 'animate-pulse' : ''}`}>
                      {displayCost.toFixed(3)}
                    </span>
                  </p>
                  <p className="text-xs text-gray-600 mb-3">
                     高质量内容生成需要计算资源。如果觉得 ResearchGPT 对您有帮助，欢迎考虑赞助支持我们！🙏
                  </p>
                  <Link href="/about#support"
                        className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full hover:bg-indigo-200 transition-colors">
                     前往赞助/反馈 <span aria-hidden="true" className="ml-1">&rarr;</span>
                  </Link>
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center pt-2">
                   由 Google Gemini 驱动，生成高质量、结构完整的 LaTeX 格式论文（可能需要几分钟）
                </p>
              )}
              {/* --- END: Modified Cost/Sponsorship Display --- */}

            </div>
          </div>

          {/* 论文内容与编辑区域 */}
          {latexContent && (
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100 mt-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5 pb-4 border-b border-gray-200 gap-4">
                 <h3 className="text-xl font-semibold text-gray-800 flex-shrink mr-4 min-w-0 break-words">
                   {paperTitle || "生成的论文"}
                 </h3>
                <div className="flex space-x-3 w-full md:w-auto justify-end flex-shrink-0">
                  <button
                    onClick={() => setIsEditMode(!isEditMode)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center whitespace-nowrap ${isEditMode ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                  >
                     {isEditMode ? (
                       <> <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg> 查看代码 </>
                     ) : (
                       <> <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg> 编辑模式 </>
                     )}
                  </button>
                  <button
                    onClick={downloadLatex}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white transition-colors duration-200 flex items-center text-sm font-medium whitespace-nowrap"
                    title="下载 .tex 文件"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                     下载 LaTeX
                  </button>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden shadow-inner">
                 {isEditMode ? (
                  <textarea
                    value={latexContent}
                    onChange={(e) => setLatexContent(e.target.value)}
                    className="w-full h-[75vh] p-5 font-mono text-sm focus:outline-none resize-y border-0 bg-gray-50 leading-relaxed"
                    aria-label="LaTeX 编辑器"
                  />
                ) : (
                  <pre className="w-full h-[75vh] p-5 font-mono text-sm overflow-auto whitespace-pre-wrap bg-gray-50 leading-relaxed" aria-label="LaTeX 代码预览">
                    {latexContent}
                  </pre>
                )}
              </div>

              <div className="mt-6 bg-indigo-50 p-4 rounded-lg border border-indigo-100 flex items-start">
                <svg className="w-6 h-6 text-indigo-500 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="font-medium text-indigo-800 mb-1">使用 Overleaf 编辑</h4>
                  <p className="text-sm text-indigo-700">
                    建议下载此 <code className="text-xs bg-indigo-100 px-1 rounded">.tex</code> 文件并在 <a href="https://www.overleaf.com" target="_blank" rel="noopener noreferrer" className="font-semibold underline hover:text-indigo-800">Overleaf.com</a> (免费在线 LaTeX 编辑器) 中打开进行编译、预览和进一步修改。
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 底部 */}
      <footer className="bg-gray-900 text-gray-300 py-10 mt-16">
        <div className="container mx-auto px-6">
           <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
             <div className="mb-6 md:mb-0">
               <h3 className="text-xl font-bold text-white">ResearchGPT</h3>
               <p className="text-sm">智能研究，探索无限</p>
             </div>
             <div className="flex flex-col items-center md:items-end">
               <p className="text-sm mb-2">© {new Date().getFullYear()} ResearchGPT. All Rights Reserved.</p>
               <div className="flex space-x-4">
                 <Link href="/about" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">关于我们</Link>
                 <span className="text-gray-500">|</span>
                 <Link href="/about#privacy" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">隐私政策</Link>
               </div>
             </div>
           </div>
         </div>
       </footer>

      {/* Hidden download link */}
      <a ref={fileDownloadRef} style={{ display: 'none' }} />
    </div>
  );
} 