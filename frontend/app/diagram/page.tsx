// frontend/app/diagram/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// 在组件顶部添加类型声明
declare global {
  interface Window {
    mermaid: {
      initialize: (config: any) => void;
      render: (id: string, text: string) => Promise<{ svg: string }>;
    } | undefined;
  }
}

export default function DiagramGenerator() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<'siliconflow' | 'gemini' | 'gpt4'>('siliconflow');
  const [mermaidCode, setMermaidCode] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);

  // 修改API设置
  const API_TOKEN = 'sk-dgyrewpnusnhloynhcfnhhdpidxwujvemeuwlznnuwjxykwo'; // 需要替换为实际的token
  const API_URL = 'https://api.siliconflow.cn/v1/images/generations';
  const GEMINI_API_KEY = 'AIzaSyDy9pYAEW7e2Ewk__9TCHAD5X_G1VhCtVw'; // 使用您现有的API Key
  const GEMINI_MODEL = 'gemini-2.0-flash-exp-image-generation';
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  // --- Prompt Function ---
  function createEnhancedPrompt(userPrompt: string): string {
      return `"${userPrompt}"。`;
  }

  const generateDiagram = async () => {
    if (!prompt.trim()) {
      setError('请输入图像描述。');
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);
    setError(null);

    try {
      // 检测是否包含mermaid格式
      if (prompt.includes("mermaid") && prompt.includes("graph")) {
        await generateMermaidDiagram(prompt);
      } else {
        // 原有的逻辑
        if (selectedModel === 'siliconflow') {
          await generateWithSiliconFlow();
        } else {
          await generateWithGemini();
        }
      }
    } catch (err: any) {
      console.error('生成图像失败:', err);
      setError(`生成图像失败: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // 添加Silicon Flow生成函数
  const generateWithSiliconFlow = async () => {
    // 设置最大重试次数
    const MAX_RETRIES = 2;
    let attempts = 0;

    const attemptGeneration = async () => {
      attempts++;
      try {
        const requestBody = {
          model: "Kwai-Kolors/Kolors",
          prompt: prompt + ", scientific diagram style, professional graph, technical illustration, clear layout, academic paper figure, simple lines, high contrast, minimalist design",
          negative_prompt: "cartoon, colorful, artistic, abstract art, hand drawn, sketch, doodle, low quality",
          image_size: "1024x1024",
          batch_size: 1,
          seed: Math.floor(Math.random() * 9999999999),
          num_inference_steps: 30,
          guidance_scale: 8.5
        };

        console.log(`Silicon Flow API 尝试 ${attempts}/${MAX_RETRIES+1}`);

        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody),
          signal: AbortSignal.timeout(60000)
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`尝试 ${attempts}/${MAX_RETRIES+1} 失败:`, errorText);
          
          if ((response.status === 500 || response.status === 503) && attempts <= MAX_RETRIES) {
            console.log(`服务器错误，${attempts}秒后重试...`);
            setError(`服务器处理请求中，正在重试 (${attempts}/${MAX_RETRIES+1})...`);
            await new Promise(resolve => setTimeout(resolve, attempts * 1000));
            return await attemptGeneration();
          }
          
          throw new Error(`API请求失败: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        
        if (data.images && data.images.length > 0 && data.images[0].url) {
          setGeneratedImage(data.images[0].url);
          return true;
        } else {
          throw new Error("API返回的数据中没有图像URL");
        }
      } catch (err: any) {
        if (err.message.includes("timeout") && attempts <= MAX_RETRIES) {
          console.log(`请求超时，${attempts}秒后重试...`);
          setError(`服务器响应超时，正在重试 (${attempts}/${MAX_RETRIES+1})...`);
          await new Promise(resolve => setTimeout(resolve, attempts * 1000));
          return await attemptGeneration();
        }
        throw err;
      }
    };

    return attemptGeneration();
  };

  // 修改Gemini生成函数，使用正确的API版本和模型
  const generateWithGemini = async () => {
    try {
      // 使用最基本的请求格式
      const requestBody = {
        contents: [{
          parts: [{ text: prompt }]
        }]
      };

      // 修正API版本为v1beta，使用已知有效的模型
      const MODEL_NAME = 'gemini-2.0-flash-exp-image-generation'; // 使用更新的模型
      const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

      console.log("发送请求到Gemini API:", MODEL_NAME);
      setError("正在连接Gemini API...");
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("API响应错误:", response.status, errorData);
        throw new Error(`Gemini API请求失败: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      console.log("API响应:", data);
      
      // 提取文本响应
      if (data.candidates && data.candidates[0]?.content?.parts) {
        const parts = data.candidates[0].content.parts;
        const textPart = parts.find(part => part.text);
        
        if (textPart) {
          console.log("找到文本响应");
          createTextImageAndDisplay(textPart.text);
          return;
        }
      }
      
      throw new Error("API响应中没有有效内容");
    } catch (err: any) {
      console.error("Gemini错误:", err);
      throw err;
    }
  };

  // 修改createTextImageAndDisplay函数来处理mermaid代码
  const createTextImageAndDisplay = (text: string) => {
    try {
      // 提取mermaid代码
      const mermaidMatch = text.match(/mermaid\s*([\s\S]*?)(?=style|$)/);
      if (mermaidMatch) {
        const code = mermaidMatch[1].trim();
        console.log("提取到mermaid代码:", code);
        setMermaidCode(code);
        return;
      }
      
      // 如果没有找到mermaid代码，使用原来的文本显示逻辑
      // 使用canvas绘制文本
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 600;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // 设置背景
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 设置文本样式
        ctx.font = '16px Arial';
        ctx.fillStyle = 'black';
        
        // 标题
        ctx.font = 'bold 18px Arial';
        ctx.fillText('Gemini AI 生成结果:', 20, 30);
        
        // 内容
        ctx.font = '14px Arial';
        const lines = text.split('\n');
        let y = 60;
        
        lines.forEach(line => {
          // 简单的文本换行处理
          const words = line.split(' ');
          let currentLine = '';
          
          words.forEach(word => {
            const testLine = currentLine + word + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > canvas.width - 40) {
              ctx.fillText(currentLine, 20, y);
              currentLine = word + ' ';
              y += 20;
            } else {
              currentLine = testLine;
            }
          });
          
          ctx.fillText(currentLine, 20, y);
          y += 20;
          
          // 限制文本显示长度
          if (y > canvas.height - 20) {
            ctx.fillText('...（文本过长，已截断）', 20, y);
            return;
          }
        });
        
        // 转为数据URL
        const dataUrl = canvas.toDataURL('image/png');
        setGeneratedImage(dataUrl);
      }
    } catch (err) {
      console.error('处理响应失败:', err);
      setError('处理响应失败，请检查控制台输出');
    }
  };

  // 修改generateMermaidDiagram函数
  const generateMermaidDiagram = async (mermaidCode: string) => {
    try {
      setError("正在渲染Mermaid图表...");
      
      // 确保代码以mermaid语法开头
      const formattedCode = mermaidCode.includes('graph') ? mermaidCode : `graph LR\n${mermaidCode}`;
      
      // 等待mermaid加载完成
      if (typeof window !== 'undefined' && !window.mermaid) {
        await new Promise<void>((resolve) => {
          const checkMermaid = setInterval(() => {
            if (window.mermaid) {
              clearInterval(checkMermaid);
              resolve();
            }
          }, 100);
        });
      }

      if (!window.mermaid) {
        throw new Error('Mermaid库未正确加载');
      }

      // 重新初始化mermaid
      window.mermaid.initialize({
        startOnLoad: true,
        theme: 'default',
        flowchart: {
          useMaxWidth: true,
          htmlLabels: true,
          curve: 'basis'
        }
      });

      // 清理旧的渲染结果
      const oldSvg = document.getElementById('mermaid-diagram');
      if (oldSvg) {
        oldSvg.remove();
      }

      // 创建新的渲染容器
      const container = document.createElement('div');
      container.style.display = 'none';
      container.id = 'mermaid-container';
      document.body.appendChild(container);

      try {
        const { svg } = await window.mermaid.render('mermaid-diagram', formattedCode);
        setMermaidCode(formattedCode);
        container.remove();
        setError(null);
      } catch (renderError) {
        console.error('Mermaid渲染错误:', renderError);
        throw new Error('图表语法错误，请检查mermaid代码格式');
      }

      return true;
    } catch (err: any) {
      console.error("Mermaid图表渲染失败:", err);
      throw err;
    }
  };

  // 建议的 Prompt 示例
   const samplePrompts = [
    "一张深度学习神经网络架构图，包含输入层、卷积层、池化层和全连接层，使用专业示意图风格，清晰的箭头连接各层",
    "一个典型的机器学习实验流程图，从数据收集、预处理、特征提取、模型训练到评估的完整过程，使用专业图表样式",
    "一张医学研究中的PRISMA流程图，展示文献筛选过程，包含识别、筛选、资格和包含步骤，每步显示文献数量",
    "一个系统架构图，展示客户端、服务器和数据库之间的交互，使用专业UML风格绘制，箭头清晰标示数据流向",
    "一张展示自然语言处理中词向量降维的t-SNE可视化图，包含聚类效果，使用学术论文常见的数据可视化风格",
    "一个比较不同算法性能的条形图，横轴是算法名称，纵轴是准确率/召回率/F1值，使用简洁专业的学术图表风格",
  ];

  const handleSamplePromptClick = (sample: string) => {
    setPrompt(sample);
  };

  useEffect(() => {
    const loadMermaid = async () => {
      try {
        if (typeof window !== 'undefined' && !window.mermaid) {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js';
          script.async = true;
          
          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });

          // 等待mermaid对象加载完成
          await new Promise<void>((resolve) => {
            const checkMermaid = setInterval(() => {
              if (window.mermaid) {
                clearInterval(checkMermaid);
                window.mermaid.initialize({
                  startOnLoad: true,
                  theme: 'default',
                  flowchart: {
                    useMaxWidth: true,
                    htmlLabels: true,
                    curve: 'basis'
                  }
                });
                resolve();
              }
            }, 100);
          });
        }
      } catch (error) {
        console.error('加载Mermaid失败:', error);
        setError('加载Mermaid库失败，请刷新页面重试');
      }
    };

    loadMermaid();

    return () => {
      const script = document.querySelector('script[src*="mermaid"]');
      if (script) {
        script.remove();
      }
    };
  }, []);

  // 添加一个新的函数来渲染mermaid图表
  const renderMermaidDiagram = async (code: string) => {
    if (window.mermaid) {
      try {
        const { svg } = await window.mermaid.render('mermaid-diagram', code);
        return svg;
      } catch (error) {
        console.error('渲染Mermaid图表失败:', error);
        throw error;
      }
    }
  };

  // 添加验证函数
  const validatePassword = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const correctPassword = `${year}${month}${day}`;
    
    if (password === '20250415' || password === correctPassword) {
      setIsAuthenticated(true);
      setShowError(false);
      localStorage.setItem('diagramAuth', 'true');
    } else {
      setIsAuthenticated(false);
      setShowError(true);
      localStorage.removeItem('diagramAuth');
    }
  };

  // 在 useEffect 中检查是否已认证
  useEffect(() => {
    const isAuth = localStorage.getItem('diagramAuth');
    if (isAuth === 'true') {
      // 验证当前日期的密码是否正确
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const correctPassword = `${year}${month}${day}`;
      
      // 如果localStorage中存储的认证已过期(不是今天的日期),则清除认证
      if (password !== '20250415' && password !== correctPassword) {
        setIsAuthenticated(false);
        localStorage.removeItem('diagramAuth');
      } else {
        setIsAuthenticated(true);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  // 1. 添加返回按钮函数
  const handleGoBack = () => {
    window.history.back();
  };

  return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* 头部导航 */}
        <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
          <div className="container mx-auto py-4 px-6 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors duration-200">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                <span className="text-2xl font-bold">ResearchGPT</span>
              </Link>
            </div>
            <nav>
              <ul className="flex space-x-4 md:space-x-6 items-center">
                <li><Link href="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-100">首页</Link></li>
                <li><Link href="/search" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-100">研究探索</Link></li>
                <li><Link href="/paper" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-100">AI论文生成</Link></li>
                <li><Link href="/diagram" className="px-3 py-2 rounded-md text-sm font-medium text-blue-600 bg-blue-50">AI图表生成</Link></li>
                <li><Link href="/about" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-100">关于</Link></li>
              </ul>
            </nav>
          </div>
        </header>

        {/* 主内容区 */}
        <main className="flex-grow container mx-auto py-16 md:py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900 fancy-title">
                生成论文插图流程图
              </h2>
              <p className="text-lg text-gray-600">
                内测中，敬请期待
              </p>
              <p className="text-sm text-red-600 mt-2 font-semibold">
                ⚠️ 警告：此功能正在内测中，部分功能可能不稳定
              </p>
            </div>

            {/* 输入区域 */}
            <div className="mb-10 bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100">
              <div className="flex flex-col space-y-5">
                <label htmlFor="prompt-input" className="block text-lg font-semibold text-gray-800 mb-2">图像或图表描述:</label>
                <textarea
                  id="prompt-input"
                  rows={4}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="例如：绘制一个展示卷积神经网络结构的流程图..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                  disabled={isGenerating}
                />

                {/* Sample Prompts */}
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">或尝试以下示例:</p>
                  <div className="flex flex-wrap gap-2">
                    {samplePrompts.map((sample, index) => (
                      <button
                        key={index}
                        onClick={() => handleSamplePromptClick(sample)}
                        disabled={isGenerating}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full hover:bg-gray-200 disabled:opacity-50 transition-colors"
                        title={sample} // 添加 title 属性以显示完整提示
                      >
                        {sample.length > 60 ? sample.substring(0, 57) + '...' : sample}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 在输入区域下方添加模型选择 */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">选择生成模型:</p>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => setSelectedModel('siliconflow')}
                      className={`px-4 py-2 rounded-md text-sm font-medium ${
                        selectedModel === 'siliconflow'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      } transition-colors`}
                    >
                      Kwai-Kolors
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedModel('gemini')}
                      className={`px-4 py-2 rounded-md text-sm font-medium ${
                        selectedModel === 'gemini'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      } transition-colors`}
                    >
                      Gemini 图像生成
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedModel('gpt4')}
                      className={`px-4 py-2 rounded-md text-sm font-medium ${
                        selectedModel === 'gpt4'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      } transition-colors`}
                    >
                      GPT-4o
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedModel === 'siliconflow' 
                      ? 'Silicon Flow提供高质量的AI图像生成，适合各种图表和图形' 
                      : selectedModel === 'gemini'
                      ? 'Gemini将提供文本描述，将自动转换为图像显示'
                      : 'GPT-4提供高质量的图表生成能力'}
                  </p>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">访问密码:</p>
                  <div className="flex space-x-2">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setShowError(false);
                      }}
                      placeholder="请输入访问密码"
                      className="flex-grow px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <button
                      onClick={validatePassword}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                      disabled={!password.trim()}
                    >
                      确认
                    </button>
                  </div>
                  {showError && (
                    <p className="text-red-500 text-xs mt-1">
                      密码错误，请重试
                    </p>
                  )}
                  {isAuthenticated && (
                    <p className="text-green-500 text-xs mt-1">
                      密码验证成功
                    </p>
                  )}
                </div>

                <button
                  onClick={generateDiagram}
                  disabled={isGenerating || !prompt.trim() || !isAuthenticated}
                  className={`w-full px-6 py-3 rounded-lg mt-4 ${
                    isGenerating || !prompt.trim() || !isAuthenticated
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'gradient-button hover:opacity-90'
                  } text-white font-semibold text-base flex items-center justify-center transition-opacity duration-200`}
                >
                  {isGenerating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      生成中...
                    </>
                  ) : !isAuthenticated ? (
                    '请先输入访问密码'
                  ) : !prompt.trim() ? (
                    '请输入图表描述'
                  ) : (
                    '🎨 生成图像/图表'
                  )}
                </button>

                {/* Error Message */}
                {error && (
                  <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-800 rounded-lg text-sm">
                    {error}
                  </div>
                )}
              </div>
            </div>

            {/* 图表显示区域 */}
            {isGenerating && (
              <div className="flex justify-center items-center mt-10 p-10 border border-dashed border-gray-300 rounded-lg bg-gray-50 min-h-[300px]">
                  {/* Loading Indicator */}
                 <div className="text-center">
                    <svg className="animate-spin mx-auto h-12 w-12 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <p className="text-gray-600">正在生成图表，请稍候...</p>
                 </div>
              </div>
            )}
            {mermaidCode && !isGenerating && (
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100 mt-10">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">生成的Mermaid图表:</h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden p-4">
                  <div className="mermaid" key={mermaidCode}>
                    {mermaidCode}
                  </div>
                </div>
              </div>
            )}
            {generatedImage && !isGenerating && !mermaidCode && (
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100 mt-10">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">生成的图表:</h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={generatedImage}
                    alt="Generated Diagram"
                    className="w-full h-auto object-contain"
                    onError={(e) => {
                      console.error("图片加载失败:", e);
                      setError("生成的图像数据无效或加载失败。请检查控制台输出。");
                      setGeneratedImage(null);
                    }}
                  />
                </div>
                <div className="mt-4 text-center">
                  <a
                    href={generatedImage}
                    download={`image_${Date.now()}.png`}
                    className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white transition-colors duration-200 text-sm font-medium"
                    target="_blank"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    下载图像
                  </a>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* 底部 */}
        <footer className="bg-gray-900 text-gray-300 py-10 mt-16">
          {/* Footer Content */}
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
     </div>
  );
}