'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';

export default function PaperGenerator() {
  const [researchTopic, setResearchTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [latexContent, setLatexContent] = useState('');
  const [paperTitle, setPaperTitle] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [language, setLanguage] = useState('english');
  const fileDownloadRef = useRef<HTMLAnchorElement>(null);

  // 生成论文
  const generatePaper = async () => {
    if (!researchTopic.trim()) return;
    
    setIsGenerating(true);
    try {
      // 首先尝试调用 Gemini API
      let response;
      try {
        response = await fetch('/api/generate-paper-gemini', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ topic: researchTopic, language }),
        });
      } catch (error) {
        console.log('Gemini API调用失败，尝试使用本地模拟API', error);
        // 如果 Gemini API 调用失败，尝试使用本地模拟API
        response = await fetch('/api/generate-paper-local', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ topic: researchTopic, language }),
        });
      }
      
      if (!response.ok) {
        throw new Error(`API响应错误: ${response.status}`);
      }
      
      const data = await response.json();
      setPaperTitle(data.title);
      setLatexContent(data.latex);
    } catch (error) {
      console.error('生成论文时出错:', error);
      
      // 所有API调用都失败，显示错误并使用内置模板作为后备
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
                  <p className="text-gray-600 mb-4">
                    预览功能需要服务器端渲染或使用 LaTeX 渲染库。在实际环境中，
                    这里将显示生成的PDF预览。
                  </p>
                  <div className="border p-4 bg-gray-50 rounded">
                    <pre className="whitespace-pre-wrap">{latexContent}</pre>
                  </div>
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