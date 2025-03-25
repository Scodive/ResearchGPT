'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// 研究计划详细信息类型
interface ResearchPlanDetail {
  id: string;
  title: string;
  description: string;
  background: string;
  methodology: string;
  expectedResults: string;
  timeline: {
    phase: string;
    duration: string;
    activities: string[];
  }[];
  resources: string[];
  tags: string[];
}

export default function PlanDetail() {
  const params = useParams();
  const id = params.id as string;
  const [isLoading, setIsLoading] = useState(true);
  const [plan, setPlan] = useState<ResearchPlanDetail | null>(null);
  const [originalPlan, setOriginalPlan] = useState<ResearchPlanDetail | null>(null); // 保存原始计划
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedSections, setExpandedSections] = useState<string[]>(['overview']);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '我已经为您生成了一个研究计划。您对这个计划有什么问题或建议？我可以帮您修改或完善计划的任何部分。' }
  ]);
  const [userMessage, setUserMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isUpdatingPlan, setIsUpdatingPlan] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (id) {
      // 根据ID生成详细研究计划
      generateDetailedPlan(id)
        .then(detailedPlan => {
          setPlan(detailedPlan);
          setOriginalPlan(JSON.parse(JSON.stringify(detailedPlan))); // 深拷贝保存原始计划
          setIsLoading(false);
        })
        .catch(error => {
          console.error('获取计划详情失败:', error);
          setIsLoading(false);
        });
    }
  }, [id]);

  // 使用Gemini API生成详细研究计划
  async function generateDetailedPlan(planId: string) {
    // 在实际应用中，先尝试从缓存或服务器获取存储的计划
    // 如果不存在，使用Gemini生成
    
    const API_KEY = 'AIzaSyDy9pYAEW7e2Ewk__9TCHAD5X_G1VhCtVw';
    const MODEL = 'gemini-1.5-flash-latest';
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
    
    // 从URL或存储中获取基本信息
    const urlParams = new URLSearchParams(window.location.search);
    const title = urlParams.get('title') || `研究计划 ${planId}`;
    const description = urlParams.get('desc') || '这是一个研究计划的详细描述';
    const tagsStr = urlParams.get('tags') || '研究,学术';
    const tags = tagsStr.split(',');
    
    // 构建详细计划生成的prompt
    const prompt = `作为研究方法学专家，请基于以下研究计划的基本信息，生成一个全面且结构化的详细研究计划：

标题: "${title}"
基本描述: "${description}"
关键词: ${tags.join(', ')}

请提供以下详细部分：
1. 研究背景与动机：当前领域状态、挑战和研究计划的重要性
2. 研究目标：3-5个具体可测量的目标
3. 文献综述：关键相关工作概述，指出空白和局限性
4. 研究方法：详细的方法论、实验设计和分析框架
5. 预期成果：预期的研究结果和贡献
6. 时间表：6-12个月的详细研究阶段和里程碑
7. 所需资源：人力、技术和其他资源需求

在回答中，为每个部分提供详细内容，确保内容与研究主题密切相关，并展示对该领域的专业理解。以JSON格式输出，结构如下：

{
  "id": "${planId}",
  "title": "...",
  "description": "...",
  "tags": ["标签1", "标签2", "..."],
  "background": "...",
  "objectives": ["目标1", "目标2", ...],
  "literature": "...",
  "methodology": "...",
  "expected_outcomes": "...",
  "timeline": [
    {"phase": "阶段1", "duration": "X周", "activities": "..."},
    ...
  ],
  "resources": "..."
}

只输出JSON，不要有其他文字。`;
    
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
      const jsonMatch = generatedText.match(/\{.*\}/s);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('无法解析API返回的JSON');
      }
    } catch (error) {
      console.error('生成详细计划失败:', error);
      // 返回基本计划作为备用
      return {
        id: planId,
        title: title,
        description: description,
        tags: tags,
        background: '无法生成详细背景信息',
        objectives: ['完成研究', '发表论文'],
        literature: '无法生成文献综述',
        methodology: '无法生成研究方法',
        expected_outcomes: '无法生成预期成果',
        timeline: [
          {phase: '计划阶段', duration: '4周', activities: '文献综述和计划制定'}
        ],
        resources: '标准研究资源'
      };
    }
  }

  // 处理发送消息
  const handleSendMessage = async () => {
    if (!userMessage.trim() || isSending || !plan) return;
    
    const newMessage = { role: 'user', content: userMessage };
    setMessages(prev => [...prev, newMessage]);
    setUserMessage('');
    setIsSending(true);
    
    try {
      // 使用Gemini API回答用户问题
      const API_KEY = 'AIzaSyDy9pYAEW7e2Ewk__9TCHAD5X_G1VhCtVw';
      const MODEL = 'gemini-1.5-flash-latest';
      const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
      
      // 构建对话历史供AI参考
      const conversationHistory = messages.map(msg => 
        `${msg.role === 'user' ? '用户' : 'AI助手'}: ${msg.content}`
      ).join('\n\n');
      
      // 构建对话的prompt
      const prompt = `你是一位专业的研究计划顾问，正在帮助用户完善以下研究计划。

当前研究计划: 
${JSON.stringify(plan, null, 2)}

对话历史:
${conversationHistory}

用户的最新问题或建议: "${userMessage}"

请提供以下两部分内容:
1. 针对用户问题的专业回答（200-300字）
2. 如果用户建议修改研究计划的特定部分，请提供具体的修改建议，格式为JSON对象，例如:
{"action": "update", "field": "要修改的字段", "content": "新内容"}

例如字段可以是"title", "description", "background", "methodology", "objectives", "timeline", "resources"等。

如果用户没有要求修改计划，则只返回回答，不需要返回JSON对象。
如果需要修改计划，先回答用户问题，然后另起一行，以"==PLAN_UPDATE=="开头，之后提供JSON更新对象。

确保你的回答对用户友好、专业且有实质性内容，并且任何修改建议都与研究主题相关。`;
      
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
            maxOutputTokens: 2048,
          }
        })
      });
      
      if (!response.ok) {
        throw new Error(`API响应错误: ${response.status}`);
      }
      
      const data = await response.json();
      let assistantResponse = data.candidates[0].content.parts[0].text;
      
      // 检查是否包含计划更新
      const updateParts = assistantResponse.split('==PLAN_UPDATE==');
      const userFacingResponse = updateParts[0].trim();
      
      // 添加助手回复到对话
      setMessages(prev => [...prev, { role: 'assistant', content: userFacingResponse }]);
      
      // 如果有计划更新指令
      if (updateParts.length > 1) {
        try {
          setIsUpdatingPlan(true);
          const updateJson = updateParts[1].trim();
          const updateData = JSON.parse(updateJson);
          
          if (updateData.action === 'update' && updateData.field && updateData.content) {
            // 更新计划
            const updatedPlan = { ...plan };
            
            // 特殊处理嵌套字段，如timeline.0.activities
            if (updateData.field.includes('.')) {
              const fieldParts = updateData.field.split('.');
              let target = updatedPlan as any;
              
              // 导航到嵌套对象的倒数第二层
              for (let i = 0; i < fieldParts.length - 1; i++) {
                const part = fieldParts[i];
                if (!isNaN(Number(part))) {
                  // 处理数组索引
                  target = target[Number(part)];
                } else {
                  target = target[part];
                }
              }
              
              // 更新最后一层
              const lastField = fieldParts[fieldParts.length - 1];
              target[lastField] = updateData.content;
            } else {
              // 简单字段直接更新
              (updatedPlan as any)[updateData.field] = updateData.content;
            }
            
            setPlan(updatedPlan);
            setHasChanges(true);
            
            // 添加系统消息通知用户计划已更新
            setTimeout(() => {
              setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: `✅ 已根据您的建议更新了研究计划的${getFieldDisplayName(updateData.field)}部分。` 
              }]);
              setIsUpdatingPlan(false);
            }, 1000);
          }
        } catch (error) {
          console.error('解析或应用更新失败:', error);
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: '抱歉，我无法应用您建议的更改。请再次尝试或使用更清晰的说明。' 
          }]);
          setIsUpdatingPlan(false);
        }
      } else {
        setIsUpdatingPlan(false);
      }
    } catch (error) {
      console.error('获取回答失败:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '抱歉，我无法处理您的请求。请稍后再试。' 
      }]);
      setIsUpdatingPlan(false);
    } finally {
      setIsSending(false);
    }
  };

  // 将字段名转换为显示名
  const getFieldDisplayName = (field: string): string => {
    const fieldMap: Record<string, string> = {
      'title': '标题',
      'description': '描述',
      'background': '研究背景',
      'methodology': '研究方法',
      'objectives': '研究目标',
      'timeline': '时间表',
      'resources': '资源',
      'expected_outcomes': '预期成果'
    };
    
    return fieldMap[field] || field;
  };

  // 重置计划到原始状态
  const resetPlan = () => {
    if (originalPlan) {
      setPlan(JSON.parse(JSON.stringify(originalPlan)));
      setHasChanges(false);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '已将研究计划重置为原始状态。' 
      }]);
    }
  };

  // 保存计划
  const savePlan = async () => {
    // 在实际应用中，这里应该调用API保存计划
    // 模拟保存成功
    setOriginalPlan(JSON.parse(JSON.stringify(plan)));
    setHasChanges(false);
    setMessages(prev => [...prev, { 
      role: 'assistant', 
      content: '✅ 研究计划已成功保存！' 
    }]);
  };

  // 切换部分展开/折叠
  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section) 
        : [...prev, section]
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-xl">研究计划未找到</div>
      </div>
    );
  }

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
                <Link href="/paper" className="hover:text-blue-500">论文生成</Link>
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
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold">{plan?.title}</h2>
            {hasChanges && (
              <div className="flex space-x-3">
                <button
                  onClick={resetPlan}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-800"
                >
                  取消修改
                </button>
                <button
                  onClick={savePlan}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded text-white"
                >
                  保存更改
                </button>
              </div>
            )}
          </div>
          
          <p className="text-xl text-gray-600 mb-4">{plan?.description}</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {plan?.tags.map((tag) => (
              <span
                key={tag}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* 选项卡导航 */}
          <div className="border-b mb-6">
            <nav className="flex space-x-8">
              <button
                className={`py-4 px-1 ${
                  activeTab === 'overview'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('overview')}
              >
                概述
              </button>
              <button
                className={`py-4 px-1 ${
                  activeTab === 'methodology'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('methodology')}
              >
                研究方法
              </button>
              <button
                className={`py-4 px-1 ${
                  activeTab === 'timeline'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('timeline')}
              >
                时间安排
              </button>
              <button
                className={`py-4 px-1 ${
                  activeTab === 'resources'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('resources')}
              >
                所需资源
              </button>
            </nav>
          </div>

          {/* 内容区 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            {activeTab === 'overview' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">研究背景</h3>
                <div className="whitespace-pre-line mb-6">{plan.background}</div>
                <h3 className="text-xl font-semibold mb-4">预期成果</h3>
                <div className="whitespace-pre-line">{plan.expectedResults}</div>
              </div>
            )}

            {activeTab === 'methodology' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">研究方法</h3>
                <div className="whitespace-pre-line">{plan.methodology}</div>
              </div>
            )}

            {activeTab === 'timeline' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">研究时间表</h3>
                <div className="space-y-6">
                  {plan.timeline.map((phase, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <h4 className="text-lg font-semibold">{phase.phase}</h4>
                      <p className="text-gray-600 mb-2">预计时长: {phase.duration}</p>
                      <ul className="list-disc list-inside space-y-1">
                        {phase.activities.map((activity, actIndex) => (
                          <li key={actIndex}>{activity}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'resources' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">所需资源</h3>
                <ul className="list-disc list-inside space-y-2">
                  {plan.resources.map((resource, index) => (
                    <li key={index}>{resource}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* 增强的对话区域 */}
        <div className="mt-8 mb-4">
          <h3 className="text-xl font-semibold mb-4">与AI讨论并优化这个研究计划</h3>
          <div className="bg-white p-6 rounded-lg shadow-md">
            {isUpdatingPlan && (
              <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4">
                <div className="flex items-center">
                  <svg className="animate-spin h-5 w-5 mr-3 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-yellow-700">正在根据您的建议更新研究计划...</p>
                </div>
              </div>
            )}
            
            <div className="mb-4 max-h-80 overflow-y-auto border rounded-lg p-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className={`${message.role === 'user' ? 'bg-gray-100' : 'bg-blue-100'} p-3 rounded-lg`}>
                    <p className="font-semibold text-gray-600">{message.role === 'user' ? '您' : 'ResearchGPT'}</p>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex items-start">
              <textarea
                placeholder="输入您的问题或建议...例如：'我觉得研究方法需要更具体'、'能否添加一个关于数据收集的阶段？'"
                className="flex-grow px-4 py-2 rounded-l-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                disabled={isSending || isUpdatingPlan}
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-r-lg h-20"
                disabled={isSending || isUpdatingPlan || !userMessage.trim()}
              >
                {isSending ? (
                  <span className="flex items-center">
                    <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    处理中
                  </span>
                ) : '发送'}
              </button>
            </div>
            
            <div className="mt-3 text-sm text-gray-500">
              <p>提示：您可以要求AI修改任何部分的计划内容，例如研究方法、时间表或资源需求。</p>
            </div>
          </div>
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
    </div>
  );
}