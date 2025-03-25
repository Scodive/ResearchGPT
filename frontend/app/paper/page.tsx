'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { LatexRenderer } from '../components/LatexRenderer';

export default function PaperGenerator() {
  const [researchTopic, setResearchTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [latexContent, setLatexContent] = useState('');
  const [paperTitle, setPaperTitle] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [language, setLanguage] = useState('english');
  const fileDownloadRef = useRef<HTMLAnchorElement>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [numPages, setNumPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCompiling, setIsCompiling] = useState(false);

  // 生成论文
  const generatePaper = async () => {
    if (!researchTopic.trim()) return;
    
    setIsGenerating(true);
    try {
      // 直接调用 Gemini API
      const API_KEY = 'AIzaSyDy9pYAEW7e2Ewk__9TCHAD5X_G1VhCtVw'; // 注意：在生产环境中不建议这样做
      const MODEL = 'gemini-1.5-flash-latest';
      const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
      
      // 生成 prompt
      const prompt = generatePrompt(researchTopic, language);
      
      // 直接发送请求
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
            temperature: 0.2,
            topP: 0.8,
            topK: 40,
            maxOutputTokens: 8192,
          }
        })
      });
      
      if (!response.ok) {
        throw new Error(`API响应错误: ${response.status}`);
      }
      
      const data = await response.json();
      
      // 从生成文本中提取 LaTeX 内容和标题
      const generatedText = data.candidates[0].content.parts[0].text;
      const { title, latex } = extractLatexContent(generatedText, researchTopic);
      
      setPaperTitle(title);
      setLatexContent(latex);
    } catch (error) {
      console.error('生成论文时出错:', error);
      
      // 调用失败，使用本地模板作为后备
      alert('生成论文失败，正在使用内置模板');
      const title = language === 'english' 
        ? `Research on ${researchTopic}: A Review`
        : `${researchTopic}研究综述`;
      setPaperTitle(title);
      setLatexContent(generateSampleLatex(researchTopic, title));
    } finally {
      setIsGenerating(false);
    }
  };

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

  // 生成示例LaTeX内容
  const generateSampleLatex = (topic: string, title: string) => {
    return `\\documentclass[conference]{IEEEtran}
\\usepackage{cite}
\\usepackage{amsmath,amssymb,amsfonts}
\\usepackage{algorithmic}
\\usepackage{graphicx}
\\usepackage{textcomp}
\\usepackage{xcolor}
\\def\\BibTeX{{\\rm B\\kern-.05em{\\sc i\\kern-.025em b}\\kern-.08em
    T\\kern-.1667em\\lower.7ex\\hbox{E}\\kern-.125emX}}
\\begin{document}

\\title{${title}}

\\author{\\IEEEauthorblockN{ResearchGPT}
\\IEEEauthorblockA{\\textit{AI Research Assistant} \\\\
\\textit{Automated Academic Writing}\\\\
research-gpt@example.com}}

\\maketitle

\\begin{abstract}
This paper presents a comprehensive review of recent advancements in ${topic}. 
We discuss the current state of research, identify key challenges, and propose potential 
directions for future work. Our analysis reveals that ${topic} is a rapidly evolving field 
with significant implications for scientific progress and practical applications.
\\end{abstract}

\\begin{IEEEkeywords}
${topic}, research, artificial intelligence, review
\\end{IEEEkeywords}

\\section{Introduction}
${topic} has emerged as a significant area of research in recent years, attracting 
attention from both academia and industry. The growing interest in this field is 
driven by its potential to revolutionize various aspects of science and technology.

\\section{Background}
\\subsection{Historical Development}
The evolution of ${topic} can be traced back to early works in the field. Initial 
research focused primarily on theoretical foundations, gradually transitioning to 
more practical applications as the technology matured.

\\subsection{Theoretical Foundations}
The theoretical underpinnings of ${topic} draw from multiple disciplines, including 
mathematics, computer science, and domain-specific knowledge.

\\section{Current Research}
\\subsection{Key Approaches}
Research in ${topic} has led to the development of several key approaches:
\\begin{itemize}
    \\item Approach 1: Description of the first major research direction
    \\item Approach 2: Description of the second major research direction
    \\item Approach 3: Description of the third major research direction
\\end{itemize}

\\subsection{Recent Advancements}
Recent years have witnessed significant progress in ${topic}, with notable 
advancements in:
\\begin{itemize}
    \\item Performance improvements through novel algorithms
    \\item Expanding application domains
    \\item Integration with complementary technologies
\\end{itemize}

\\section{Challenges and Opportunities}
Despite the progress, several challenges remain in ${topic}:
\\begin{itemize}
    \\item Challenge 1: Description of a major unsolved problem
    \\item Challenge 2: Description of a technical limitation
    \\item Challenge 3: Description of a practical implementation issue
\\end{itemize}

These challenges present opportunities for future research and innovation.

\\section{Future Directions}
Based on our analysis, we identify several promising directions for future research:
\\begin{itemize}
    \\item Direction 1: Potential research focus area
    \\item Direction 2: Another potential research focus area
    \\item Direction 3: A third potential research focus area
\\end{itemize}

\\section{Conclusion}
In this paper, we have presented a comprehensive review of ${topic}. Our analysis 
highlights the significant progress made in this field, as well as the challenges 
that remain to be addressed. The future of ${topic} appears promising, with ample 
opportunities for innovative research and practical applications.

\\begin{thebibliography}{00}
\\bibitem{b1} Author1, Author2, "Title of the first paper," Journal Name, vol. 1, no. 1, pp. 1-10, 2023.
\\bibitem{b2} Author3, Author4, "Title of the second paper," Proceedings of Conference, pp. 11-20, 2022.
\\bibitem{b3} Author5, "Title of the third paper," Journal Name, vol. 2, no. 2, pp. 21-30, 2021.
\\end{thebibliography}

\\end{document}`;
  };

  // 为前端添加 prompt 生成函数
  function generatePrompt(topic: string, language: string) {
    const isEnglish = language.toLowerCase() === 'english';
    
    return isEnglish ? 
      `You are a leading researcher and professor in the field of ${topic} with numerous publications in top journals. Create a complete, innovative IEEE-formatted LaTeX paper on "${topic}" that demonstrates original thinking and novel approaches.

REQUIREMENTS:
1. The paper MUST be comprehensive (5-6 pages when compiled) with significant technical depth
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
1. 论文必须全面（编译后5-6页）且具有显著的技术深度
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

  // 添加 LaTeX 内容提取函数
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

  // 添加编译函数
  const compileToPdf = async () => {
    if (!latexContent) return;
    
    setIsCompiling(true);
    try {
      // 使用 Latex.js 或发送到后端编译服务
      const response = await fetch('/api/compile-latex', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latex: latexContent }),
      });
      
      if (!response.ok) {
        throw new Error(`编译失败: ${response.status}`);
      }
      
      // 获取PDF内容
      const pdfBlob = await response.blob();
      setPdfBlob(pdfBlob);
      setPreviewMode(true);
    } catch (error) {
      console.error('编译PDF时出错:', error);
      alert('PDF编译失败，请检查LaTeX代码');
    } finally {
      setIsCompiling(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* 头部导航 */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">
            <Link href="/">ResearchGPT</Link>
          </h1>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link href="/" className="hover:text-blue-500">首页</Link>
              </li>
              <li>
                <Link href="/paper" className="text-blue-500 font-semibold">论文生成</Link>
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
          <h2 className="text-3xl font-bold mb-6 text-center">AI 论文生成器</h2>
          <p className="text-lg text-gray-600 mb-8 text-center">
            输入研究主题，自动生成高质量的学术论文（IEEE格式）- Powered by Gemini 2.0
          </p>

          {/* 输入区域 */}
          <div className="mb-8">
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  value={researchTopic}
                  onChange={(e) => setResearchTopic(e.target.value)}
                  placeholder="输入研究主题，例如：人工智能、机器学习、量子计算..."
                  className="flex-grow px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isGenerating}
                />
                
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      : 'bg-blue-500 hover:bg-blue-600'
                  } text-white font-medium`}
                >
                  {isGenerating ? (
                    <span className="flex items-center">
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
                由 Google Gemini 2.0 Flash 提供支持，生成高质量 LaTeX 格式论文
              </p>
            </div>
          </div>

          {/* 论文编辑与预览区域 */}
          {latexContent && (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold">{paperTitle}</h3>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setPreviewMode(!previewMode)}
                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
                  >
                    {previewMode ? '编辑模式' : '预览模式'}
                  </button>
                  <button
                    onClick={downloadLatex}
                    className="px-4 py-2 rounded bg-green-500 hover:bg-green-600 text-white"
                  >
                    下载 LaTeX
                  </button>
                  <a ref={fileDownloadRef} style={{ display: 'none' }} />
                </div>
              </div>

              {previewMode ? (
                <div className="bg-white p-8 border rounded-lg shadow-md">
                  {pdfBlob ? (
                    <div className="flex flex-col">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <button 
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage <= 1}
                            className="px-3 py-1 bg-gray-200 rounded mr-2 disabled:opacity-50"
                          >
                            上一页
                          </button>
                          <span className="mx-2">
                            {currentPage} / {numPages}
                          </span>
                          <button 
                            onClick={() => setCurrentPage(p => Math.min(numPages, p + 1))}
                            disabled={currentPage >= numPages}
                            className="px-3 py-1 bg-gray-200 rounded ml-2 disabled:opacity-50"
                          >
                            下一页
                          </button>
                        </div>
                        <button
                          onClick={() => {
                            const pdfUrl = URL.createObjectURL(pdfBlob);
                            window.open(pdfUrl, '_blank');
                          }}
                          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          在新标签打开
                        </button>
                      </div>
                      
                      <div className="border rounded overflow-auto" style={{ height: '70vh' }}>
                        <Document
                          file={URL.createObjectURL(pdfBlob)}
                          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                        >
                          <Page 
                            pageNumber={currentPage} 
                            scale={1.5}
                            renderTextLayer={true}
                            renderAnnotationLayer={true}
                          />
                        </Document>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8">
                      <p className="text-gray-600 mb-4">
                        LaTeX预览模式 - 点击下方按钮编译生成PDF
                      </p>
                      <button
                        onClick={compileToPdf}
                        disabled={isCompiling}
                        className={`px-4 py-2 rounded ${isCompiling ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                      >
                        {isCompiling ? '编译中...' : '编译PDF'}
                      </button>
                      <div className="mt-6 border p-4 bg-gray-50 rounded w-full">
                        <LatexRenderer content={latexContent} />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden shadow-md">
                  <textarea
                    value={latexContent}
                    onChange={(e) => setLatexContent(e.target.value)}
                    className="w-full h-[500px] p-4 font-mono text-sm bg-gray-50 focus:outline-none"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* 底部 */}
      <footer className="bg-gray-800 text-white py-8 mt-8">
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
    </div>
  );
} 