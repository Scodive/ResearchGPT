'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Image from 'next/image'; // Import Image for potential future use or refinement
import ReactMarkdown from 'react-markdown'; // Import react-markdown
import remarkGfm from 'remark-gfm'; // Import remark-gfm


// 研究计划接口定义
interface DetailedPlan {
  id: string;
  title: string;
  description: string;
  tags: string[];
  background: string;
  objectives: string[];
  literature: string;
  methodology: string;
  expected_outcomes: string;
  timeline: { phase: string; duration: string; activities: string }[];
  resources: string;
}

export default function PlanDetail() {
  const params = useParams();
  const [plan, setPlan] = useState<DetailedPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Array<{type: 'user' | 'ai', content: string}>>([]);
  const [chatInput, setChatInput] = useState('');
  const [isGeneratingPaper, setIsGeneratingPaper] = useState(false);
  const chatMessagesEndRef = useRef<HTMLDivElement>(null); // Ref for scrolling chat

  useEffect(() => {
    const fetchPlan = async () => {
      if (params.id) {
        // 从URL获取ID并解码以恢复原始研究主题
        const decodedTopic = decodeURIComponent(params.id as string);
        setTitle(decodedTopic); // 设置标题为原始研究主题
        
        // 检查是否有存储的详细计划
        const storedPlanKey = `plan_${encodeURIComponent(decodedTopic)}`;
        const storedPlan = localStorage.getItem(storedPlanKey);
        
        if (storedPlan) {
          try {
            setPlan(JSON.parse(storedPlan));
            setIsLoading(false);
          } catch (e) {
            console.error('解析存储的计划数据失败:', e);
            generateNewPlan(decodedTopic);
          }
        } else {
          generateNewPlan(decodedTopic);
        }
      }
    };
    
    fetchPlan();
  }, [params.id]);

  useEffect(() => {
    // Scroll to bottom of chat when messages update
    if (showChat && chatMessagesEndRef.current) {
      chatMessagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, showChat]);

  // 生成新计划
  const generateNewPlan = async (topic: string) => {
    try {
      const newPlan = await generateDetailedPlan(topic);
      setPlan(newPlan);
      // 存储到本地存储
      localStorage.setItem(`plan_${encodeURIComponent(topic)}`, JSON.stringify(newPlan));
      setIsLoading(false);
    } catch (error) {
      console.error('生成计划失败:', error);
      // 使用备用计划
      const fallbackPlan: DetailedPlan = {
        id: '1',
        title: topic,
        description: `关于${topic}的研究计划`,
        tags: ['研究', topic], // 确保始终有tags数组
        background: '研究背景将在此生成',
        objectives: ['完成研究目标1', '完成研究目标2'],
        literature: '相关文献综述将在此生成',
        methodology: '研究方法将在此生成',
        expected_outcomes: '预期成果将在此生成',
        timeline: [
          { phase: '第一阶段', duration: '3个月', activities: '初步研究和文献综述' },
          { phase: '第二阶段', duration: '6个月', activities: '实验实施和数据收集' }
        ],
        resources: '所需资源将在此生成'
      };
      setPlan(fallbackPlan);
      localStorage.setItem(`plan_${encodeURIComponent(topic)}`, JSON.stringify(fallbackPlan));
      setIsLoading(false);
    }
  };

  // 使用Gemini API生成详细研究计划
  async function generateDetailedPlan(topic: string): Promise<DetailedPlan> {
    setIsLoading(true);
    
    const API_KEY = 'AIzaSyDy9pYAEW7e2Ewk__9TCHAD5X_G1VhCtVw';
    const MODEL = 'gemini-2.0-flash-exp';
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
    
    // 构建prompt
    const prompt = `为主题"${topic}"创建一个详细的研究计划。输出应为JSON格式，包含以下字段：

    - id: 唯一标识符，可以是数字字符串
    - title: 研究主题的标题，应当与"${topic}"相关
    - description: 简短的研究项目描述（约100字）
    - tags: 与研究相关的标签数组（3-5个标签）
    - background: 研究背景介绍（约200字）
    - objectives: 研究目标数组（3-5个目标）
    - literature: 简要的文献综述（约200字）
    - methodology: 研究方法详细说明（约200字） 
    - expected_outcomes: 预期研究成果（约150字）
    - timeline: 包含研究阶段的对象数组，每个对象有phase（阶段名称）、duration（持续时间）和activities（活动描述）字段
    - resources: 所需资源和工具（约100字）

    确保输出是有效的JSON格式，包含所有上述字段。不要包含任何其他文本或解释，只返回JSON对象。`;
    
    try {
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
            temperature: 0.4,
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
      const generatedText = data.candidates[0].content.parts[0].text;
      
      // 提取JSON
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsedPlan = JSON.parse(jsonMatch[0]);
        // 确保plan中有tags字段，即使API没有返回
        if (!parsedPlan.tags || !Array.isArray(parsedPlan.tags)) {
          parsedPlan.tags = [topic, '研究'];
        }
        return parsedPlan;
      } else {
        throw new Error('无法解析API返回的JSON');
      }
    } catch (error) {
      console.error('生成详细计划失败:', error);
      throw error;
    }
  }

  // 更新研究计划
  const updatePlan = async () => {
    if (!title.trim()) return;
    setIsLoading(true);
    
    try {
      const updatedPlan = await generateDetailedPlan(title);
      setPlan(updatedPlan);
      // 更新本地存储
      localStorage.setItem(`plan_${encodeURIComponent(title)}`, JSON.stringify(updatedPlan));
      setIsEditing(false);
      setIsLoading(false);
    } catch (error) {
      console.error('更新计划失败:', error);
      setIsLoading(false);
    }
  };

  // 修改生成论文函数
  const generatePaperFromPlan = async () => {
    if (!plan) return;
    setIsGeneratingPaper(true);
    
    try {
      // 直接调用 Gemini API
      const API_KEY = 'AIzaSyDy9pYAEW7e2Ewk__9TCHAD5X_G1VhCtVw';
      const MODEL = 'gemini-2.0-flash-exp';
      const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
      
      // 构建更详细的 prompt
      const prompt = `基于以下研究计划生成一篇完整的学术论文：
      
      标题：${plan.title}
      研究背景：${plan.background}
      研究目标：${plan.objectives.join('\n')}
      文献综述：${plan.literature}
      研究方法：${plan.methodology}
      预期成果：${plan.expected_outcomes}
      研究时间线：${plan.timeline.map(t => `${t.phase}: ${t.activities}`).join('\n')}
      
      请生成一篇完整的IEEE格式学术论文，必须包含以下部分：
      
      \\documentclass[conference]{IEEEtran}
      \\usepackage{cite}
      \\usepackage{amsmath,amssymb,amsfonts}
      \\usepackage{graphicx}
      \\usepackage{textcomp}
      \\usepackage{xcolor}
      
      \\begin{document}
      
      \\title{标题}
      \\author{作者}
      \\maketitle
      
      \\begin{abstract}
      [摘要部分]
      \\end{abstract}
      
      \\begin{IEEEkeywords}
      [关键词]
      \\end{IEEEkeywords}
      
      \\section{引言}
      [详细的研究背景和动机]
      
      \\section{相关工作}
      [文献综述]
      
      \\section{研究方法}
      [详细的方法论]
      
      \\section{实验设计}
      [实验方案]
      
      \\section{预期结果}
      [预期成果和影响]
      
      \\section{结论}
      [总结和展望]
      
      \\bibliographystyle{IEEEtran}
      \\bibliography{references}
      
      \\end{document}
      
      请确保：
      1. 生成完整的LaTeX代码，包含所有必要的包和格式设置
      2. 内容要专业、严谨，符合学术论文标准
      3. 各部分内容要连贯、完整
      4. 要包含参考文献
      5. 确保LaTeX代码可以直接编译`;
      
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
            temperature: 0.3,
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
      const generatedText = data.candidates[0].content.parts[0].text;
      
      // 提取LaTeX内容
      const latexContent = generatedText.replace(/```latex\n?|\n?```/g, '').trim();
      
      // 创建Blob对象
      const blob = new Blob([latexContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      
      // 显示下载提示
      const shouldDownload = window.confirm('论文生成完成！是否下载LaTeX文件？\n\n提示：您可以使用Overleaf在线编辑和预览LaTeX文件。');
      
      if (shouldDownload) {
        // 创建下载链接并触发下载
        const a = document.createElement('a');
        a.href = url;
        a.download = `${plan.title.replace(/\s+/g, '_')}.tex`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // 等待一小段时间确保下载开始
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // 清理URL对象
      window.URL.revokeObjectURL(url);
      
      // 询问是否跳转到预览页面
      const shouldPreview = window.confirm('是否跳转到论文预览页面？');
      
      if (shouldPreview) {
        // 跳转到论文页面并传递生成的内容
        window.location.href = `/paper?title=${encodeURIComponent(plan.title)}&content=${encodeURIComponent(latexContent)}`;
      }
    } catch (error) {
      console.error('生成论文失败:', error);
      alert('生成论文时出错，请稍后重试');
    } finally {
      setIsGeneratingPaper(false);
    }
  };

  // 修改对话功能
  const sendMessage = async () => {
    if (!chatInput.trim() || !plan) return;

    const userMessage = { type: 'user' as const, content: chatInput };
    setMessages(prev => [...prev, userMessage]);
    setChatInput('');
    // Scroll to bottom after sending user message
    requestAnimationFrame(() => {
      if (chatMessagesEndRef.current) {
        chatMessagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    });

    try {
      // Directly call Gemini API
      const API_KEY = 'AIzaSyDy9pYAEW7e2Ewk__9TCHAD5X_G1VhCtVw';
      const MODEL = 'gemini-2.0-flash-exp'; // Use 1.5 flash, 2.0 might not exist or cause issues
      const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

      const prompt = `作为研究助手，基于以下研究计划回答问题或提供建议：

研究主题：${plan.title}
研究背景：${plan.background}
研究目标：${plan.objectives.join('\\n')}
研究方法：${plan.methodology}
预期成果：${plan.expected_outcomes}

用户问题/建议：${userMessage.content}

请提供专业、具体且有建设性的回答。如果用户提出了改进建议，请在回复中清晰地说明修改方案，并可以使用 Markdown 格式（例如 **加粗**, *斜体*, 列表 - 或 *) 来组织内容。`;

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7, topP: 0.8, topK: 40, maxOutputTokens: 1024,
          }
        })
      });

      if (!response.ok) throw new Error(`API响应错误: ${response.status}`);

      const data = await response.json();
      const reply = data.candidates[0].content.parts[0].text;

      // Add AI reply
      setMessages(prev => [...prev, { type: 'ai', content: reply }]);

    } catch (error) {
      console.error('发送消息失败:', error);
      setMessages(prev => [...prev, { type: 'ai', content: '抱歉，获取回复时出错，请稍后重试。' }]);
    }
  };

  // 修改计划功能 - Accepts suggestion content as parameter
  const modifyPlanBasedOnSuggestion = async (suggestionContent: string) => {
    if (!plan) return; // Only need the plan

    // Consider adding a dedicated loading state for modification
    setIsLoading(true); // Using the general loading state for now

    try {
      const API_KEY = 'AIzaSyDy9pYAEW7e2Ewk__9TCHAD5X_G1VhCtVw';
      const MODEL = 'gemini-2.0-flash-exp'; // Use a reliable model for generation
      const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

      const prompt = `基于以下原始研究计划和 AI 提供的具体改进建议，生成一个更新后的研究计划JSON对象。

原始计划：
\`\`\`json
${JSON.stringify(plan, null, 2)}
\`\`\`

AI 改进建议：
"${suggestionContent}"

请分析建议内容，并将相关的、合理的修改融入到原始计划中。输出必须是一个**完整且有效**的 JSON 对象，该对象代表**更新后**的研究计划，保持原有 JSON 结构。只输出 JSON 对象，不要包含任何其他解释性文字或 markdown 标记。`;

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.4, topP: 0.8, topK: 40, maxOutputTokens: 8192,
          }
        })
      });

      if (!response.ok) throw new Error(`API响应错误: ${response.status}`);

      const data = await response.json();
      const generatedText = data.candidates[0].content.parts[0].text;

      // Extract JSON
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const updatedPlan = JSON.parse(jsonMatch[0]);
        // Basic validation to ensure essential fields exist
        if (!updatedPlan.title || !updatedPlan.objectives) {
           throw new Error("生成的计划缺少关键字段");
        }

        setPlan(updatedPlan);
        // Update local storage with the correct key (based on the potentially updated title)
        localStorage.setItem(`plan_${encodeURIComponent(updatedPlan.title)}`, JSON.stringify(updatedPlan));
        // If the title changed during modification, update the state
        if (updatedPlan.title !== title) {
             setTitle(updatedPlan.title);
             // Optionally update URL, though this can be complex if ID needs to change
             // window.history.pushState({}, '', `/plan/${encodeURIComponent(updatedPlan.title)}`);
        }

        // Add a confirmation message to chat
        setMessages(prev => [...prev, { type: 'ai', content: `✅ 研究计划已根据建议更新。\n新的标题是："${updatedPlan.title}"` }]);
        // Optionally close the chat after successful update?
        // setShowChat(false);
      } else {
        console.error("未找到 JSON:", generatedText);
        throw new Error('无法从API响应中解析更新后的计划 JSON');
      }
    } catch (error) {
      console.error('根据建议修改计划失败:', error);
      // Add error message to chat
      setMessages(prev => [...prev, { type: 'ai', content: `❌ 抱歉，更新计划时出错：${error.message}` }]);
    } finally {
      setIsLoading(false); // Stop loading indicator
    }
  };

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
              <li><Link href="/paper" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-100">AI论文生成</Link></li>
              <li><Link href="/about" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-100">关于</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="flex-grow container mx-auto py-12 px-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-80">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            <p className="ml-4 text-lg text-gray-600">正在生成研究计划...</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-10 border border-gray-100">
            {isEditing ? (
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-8">
                <h3 className="text-xl font-semibold mb-5 text-gray-800">编辑研究主题</h3>
                <div className="mb-5">
                  <label htmlFor="edit-title" className="block text-gray-700 mb-2 font-medium">新的研究主题</label>
                  <input
                    id="edit-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="输入新的研究主题"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors duration-200"
                  >
                    取消
                  </button>
                  <button
                    onClick={updatePlan}
                    disabled={isLoading}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        更新中...
                      </>
                    ) : (
                      '确认更新计划'
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-gray-200">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-0">{title}</h2>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg flex items-center hover:bg-indigo-200 transition-colors text-sm font-medium"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                  编辑主题
                </button>
              </div>
            )}

            {plan && (
              <div className="space-y-10">
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                  <p className="text-gray-700 mb-5 leading-relaxed">{plan.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {plan.tags && Array.isArray(plan.tags) && plan.tags.length > 0 ? (
                      plan.tags.map((tag, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1.5 rounded-full">
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="bg-gray-100 text-gray-800 text-xs font-medium px-3 py-1.5 rounded-full">
                        综合研究
                      </span>
                    )}
                  </div>
                </div>

                {[
                  { title: '研究背景', content: plan.background },
                  { title: '文献综述', content: plan.literature },
                  { title: '研究方法', content: plan.methodology },
                  { title: '预期成果', content: plan.expected_outcomes },
                  { title: '所需资源', content: plan.resources },
                ].map((section) => (
                  <div key={section.title}>
                    <h3 className="text-xl font-semibold mb-3 text-gray-800">{section.title}</h3>
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                      <p className="text-gray-700 leading-relaxed">{section.content || '内容待生成...'}</p>
                    </div>
                  </div>
                ))}

                <div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">研究目标</h3>
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                    <ul className="list-decimal pl-5 space-y-2">
                      {plan.objectives && Array.isArray(plan.objectives) && plan.objectives.length > 0 ? (
                        plan.objectives.map((objective, index) => (
                          <li key={index} className="text-gray-700 leading-relaxed">{objective}</li>
                        ))
                      ) : (
                        <li className="text-gray-500 italic">暂无具体目标</li>
                      )}
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">研究时间线</h3>
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                    <div className="space-y-6">
                      {plan.timeline && Array.isArray(plan.timeline) && plan.timeline.length > 0 ? (
                        plan.timeline.map((phase, index) => (
                          <div key={index} className="relative pl-8 pb-4 border-l-2 border-blue-300 last:border-l-transparent last:pb-0">
                             <div className="absolute -left-[11px] top-0 h-5 w-5 rounded-full bg-blue-500 ring-4 ring-white"></div>
                            <h4 className="font-medium text-lg text-gray-900">{phase.phase}</h4>
                            <p className="text-sm text-gray-500 mb-1">{phase.duration}</p>
                            <p className="text-gray-700 leading-relaxed">{phase.activities}</p>
                          </div>
                        ))
                      ) : (
                         <p className="text-gray-500 italic">暂无时间线规划</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setShowChat(true)}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                讨论此计划
              </button>

              <button
                onClick={generatePaperFromPlan}
                disabled={isGeneratingPaper}
                className="group relative flex-1 px-6 py-3 bg-green-600 text-white rounded-lg flex items-center justify-center hover:bg-green-700 transition-colors duration-200 font-medium"
              >
                {isGeneratingPaper ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    论文生成中...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    生成 LaTeX 论文
                  </>
                )}
                <div className="absolute invisible group-hover:visible bg-black text-white text-xs rounded py-1 px-2 -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  基于此计划生成论文初稿
                </div>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* 对话框 */}
      {showChat && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-xl w-full max-w-2xl h-[75vh] max-h-[800px] flex flex-col shadow-2xl">
            <div className="p-5 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">
              <h3 className="text-lg font-semibold text-gray-800">讨论研究计划</h3>
              <button
                onClick={() => setShowChat(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-white">
              {messages.map((message, index) => (
                <div key={index} className={`flex flex-col ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] rounded-lg px-4 py-2 shadow-sm ${message.type === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                    {message.type === 'ai' ? (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        className="prose prose-sm max-w-none"
                        components={{
                          a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline"/>,
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    ) : (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    )}
                  </div>
                  {message.type === 'ai' && (
                    <div className="mt-2 text-right w-full max-w-[85%]">
                      <button
                        onClick={() => modifyPlanBasedOnSuggestion(message.content)}
                        disabled={isLoading}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200 flex items-center ml-auto ${
                          isLoading
                           ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                           : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                         }`}
                        title="根据这条建议更新研究计划"
                      >
                         {isLoading ? (
                           <>
                             <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                              处理中...
                           </>
                          ) : (
                            <>
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                              按此建议更新
                            </>
                          )}
                      </button>
                    </div>
                  )}
                </div>
              ))}
              <div ref={chatMessagesEndRef} />
            </div>

            <div className="p-4 border-t bg-gray-50 rounded-b-xl flex-shrink-0">
              <div className="flex items-center space-x-3">
                <textarea
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="在此输入您的问题或建议 (Shift+Enter 换行)..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none overflow-y-auto"
                  rows={1}
                  style={{ maxHeight: '100px' }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!chatInput.trim()}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed self-end"
                  title="发送消息"
                >
                  <svg className="w-5 h-5 transform rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 16.571V11a1 1 0 112 0v5.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
}