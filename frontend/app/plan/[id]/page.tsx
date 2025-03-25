'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

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
  const [showModifyButton, setShowModifyButton] = useState(false);

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
    const MODEL = 'gemini-1.5-flash-latest';
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
      
      // 构建 prompt
      const prompt = `基于以下研究计划生成一篇完整的学术论文：
      
      标题：${plan.title}
      研究背景：${plan.background}
      研究目标：${plan.objectives.join('\n')}
      研究方法：${plan.methodology}
      预期成果：${plan.expected_outcomes}
      
      请生成一篇完整的IEEE格式学术论文，包含以下部分：
      1. 标题
      2. 摘要
      3. 关键词
      4. 引言
      5. 相关工作
      6. 方法
      7. 实验设计
      8. 结果分析
      9. 讨论
      10. 结论
      11. 参考文献
      
      使用LaTeX格式输出，确保包含必要的LaTeX包和格式设置。`;
      
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
      
      // 跳转到论文页面
      window.location.href = `/paper?title=${encodeURIComponent(plan.title)}&content=${encodeURIComponent(latexContent)}`;
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
    
    const newMessage = { type: 'user' as const, content: chatInput };
    setMessages(prev => [...prev, newMessage]);
    setChatInput('');
    
    try {
      // 直接调用 Gemini API
      const API_KEY = 'AIzaSyDy9pYAEW7e2Ewk__9TCHAD5X_G1VhCtVw';
      const MODEL = 'gemini-2.0-flash-exp';
      const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
      
      const prompt = `作为研究助手，基于以下研究计划回答问题或提供建议：

研究主题：${plan.title}
研究背景：${plan.background}
研究目标：${plan.objectives.join('\n')}
研究方法：${plan.methodology}
预期成果：${plan.expected_outcomes}

用户问题/建议：${chatInput}

请提供专业、具体且有建设性的回答，如果用户提出了改进建议，请给出具体的修改方案。`;
      
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
      
      // 添加AI回复
      setMessages(prev => [...prev, { type: 'ai', content: reply }]);
      
      // 检查是否包含修改建议
      if (reply.includes('建议修改') || reply.includes('可以改进')) {
        setShowModifyButton(true);
      }
    } catch (error) {
      console.error('发送消息失败:', error);
      setMessages(prev => [...prev, { type: 'ai', content: '抱歉，获取回复时出错，请稍后重试。' }]);
    }
  };

  // 添加修改计划功能
  const modifyPlanBasedOnSuggestion = async () => {
    if (!plan || messages.length === 0) return;
    
    const lastAIMessage = messages[messages.length - 1].content;
    setIsLoading(true);
    
    try {
      const API_KEY = 'AIzaSyDy9pYAEW7e2Ewk__9TCHAD5X_G1VhCtVw';
      const MODEL = 'gemini-1.5-flash-latest';
      const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
      
      const prompt = `基于以下原始研究计划和改进建议，生成一个更新后的研究计划：

原始计划：
${JSON.stringify(plan, null, 2)}

改进建议：
${lastAIMessage}

请生成一个包含所有必要字段的新JSON计划，保持原有结构但融入改进建议。`;
      
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
        const updatedPlan = JSON.parse(jsonMatch[0]);
        setPlan(updatedPlan);
        // 更新本地存储
        localStorage.setItem(`plan_${encodeURIComponent(title)}`, JSON.stringify(updatedPlan));
        setShowModifyButton(false);
        setMessages(prev => [...prev, { type: 'ai', content: '✅ 研究计划已根据建议更新' }]);
      }
    } catch (error) {
      console.error('修改计划失败:', error);
      setMessages(prev => [...prev, { type: 'ai', content: '抱歉，更新计划时出错，请稍后重试。' }]);
    } finally {
      setIsLoading(false);
    }
  };

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
                <Link href="/paper" className="hover:text-blue-500">AI论文生成</Link>
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
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            {isEditing ? (
              <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h3 className="text-xl font-semibold mb-4">编辑研究计划</h3>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">研究主题</label>
                  <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button 
                    onClick={() => setIsEditing(false)} 
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                  >
                    取消
                  </button>
                  <button 
                    onClick={updatePlan} 
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    更新计划
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">{title}</h2>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center hover:bg-blue-600 transition-colors"
                >
                  <span className="mr-2">✏️</span> 编辑计划
                </button>
              </div>
            )}

            {plan && (
              <div className="space-y-8">
                <div>
                  <p className="text-gray-700 mb-4">{plan.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {/* 确保tags存在并且是数组才使用map */}
                    {plan.tags && Array.isArray(plan.tags) ? (
                      plan.tags.map((tag, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                        研究
                      </span>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">研究背景</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">{plan.background}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">研究目标</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <ul className="list-disc pl-5 space-y-2">
                      {/* 确保objectives存在且是数组 */}
                      {plan.objectives && Array.isArray(plan.objectives) ? (
                        plan.objectives.map((objective, index) => (
                          <li key={index} className="text-gray-700">{objective}</li>
                        ))
                      ) : (
                        <li className="text-gray-700">完成研究目标</li>
                      )}
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">文献综述</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">{plan.literature}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">研究方法</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">{plan.methodology}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">预期成果</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">{plan.expected_outcomes}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">研究时间线</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-4">
                      {/* 确保timeline存在且是数组 */}
                      {plan.timeline && Array.isArray(plan.timeline) ? (
                        plan.timeline.map((phase, index) => (
                          <div key={index} className="border-l-4 border-blue-500 pl-4">
                            <h4 className="font-medium text-lg">{phase.phase} <span className="text-gray-500 text-sm">({phase.duration})</span></h4>
                            <p className="text-gray-700">{phase.activities}</p>
                          </div>
                        ))
                      ) : (
                        <div className="border-l-4 border-blue-500 pl-4">
                          <h4 className="font-medium text-lg">研究阶段 <span className="text-gray-500 text-sm">(3-6个月)</span></h4>
                          <p className="text-gray-700">进行研究活动</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">所需资源</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">{plan.resources}</p>
                  </div>
                </div>
              </div>
            )}

            {/* 在研究计划内容后添加操作按钮 */}
            <div className="flex space-x-4 mt-8">
              <button
                onClick={() => setShowChat(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center hover:bg-blue-600 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                讨论研究计划
              </button>
              
              <button
                onClick={generatePaperFromPlan}
                disabled={isGeneratingPaper}
                className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center hover:bg-green-600 transition-colors"
              >
                {isGeneratingPaper ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    生成论文中...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    基于此计划生成论文
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* 对话框 */}
      {showChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl h-[600px] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-semibold">研究计划讨论</h3>
              <button 
                onClick={() => setShowChat(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="输入您的问题或建议..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={sendMessage}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  发送
                </button>
              </div>
            </div>

            {showModifyButton && (
              <div className="p-4 bg-blue-50 rounded-lg mt-4">
                <p className="text-sm text-gray-700 mb-2">AI助手提供了改进建议，是否要更新研究计划？</p>
                <button
                  onClick={modifyPlanBasedOnSuggestion}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      更新中...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      根据建议更新计划
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 底部 */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">ResearchGPT</h3>
              <p className="text-gray-300">智能研究助手</p>
            </div>
            <div className="flex flex-col items-end">
              <p>© {new Date().getFullYear()} ResearchGPT. 保留所有权利。</p>
              <div className="mt-2 text-sm">
                <Link href="/about" className="text-gray-300 hover:text-white mr-4">
                  关于
                </Link>
                <Link href="/privacy" className="text-gray-300 hover:text-white">
                  隐私协议
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}