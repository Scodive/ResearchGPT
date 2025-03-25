'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

// 研究计划类型定义
interface ResearchPlan {
  id: string;
  title: string;
  description: string;
  tags: string[];
}

// 创建一个包含搜索参数逻辑的组件
function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams?.get('q') || '';
  const [isLoading, setIsLoading] = useState(true);
  const [researchPlans, setResearchPlans] = useState<ResearchPlan[]>([]);

  useEffect(() => {
    if (query) {
      setIsLoading(true);
      // 使用Gemini API生成研究计划
      generateResearchPlans(query)
        .then(plans => {
          setResearchPlans(plans);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('生成研究计划失败:', error);
          // 使用备用模拟计划
          const mockPlans = [
            {
              id: '1',
              title: `${query}领域中深度学习新方法的研究`,
              description: `通过改进现有深度学习架构，解决当前${query}领域中的性能瓶颈问题`,
              tags: ['深度学习', '人工智能', query],
            },
            {
              id: '2',
              title: `基于知识图谱的${query}数据分析框架`,
              description: `构建专门针对${query}领域的知识图谱，提高数据关联分析效率`,
              tags: ['知识图谱', '数据分析', query],
            },
            {
              id: '3',
              title: `${query}领域中的不确定性量化研究`,
              description: `研究${query}中的不确定性来源并提出量化方法，提高模型可解释性`,
              tags: ['不确定性', '可解释AI', query],
            },
          ];
          setResearchPlans(mockPlans);
          setIsLoading(false);
        });
    }
  }, [query]);

  // 直接从前端调用Gemini API生成研究计划
  async function generateResearchPlans(topic: string): Promise<ResearchPlan[]> {
    const API_KEY = 'AIzaSyDy9pYAEW7e2Ewk__9TCHAD5X_G1VhCtVw';
    const MODEL = 'gemini-1.5-flash-latest';
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
    
    // 生成研究计划的prompt
    const prompt = `作为研究主题探索专家，针对"${topic}"领域，创建4个有创新性和可行性的研究计划。
    
    每个研究计划必须包含：
    1. 一个引人注目且具体的标题
    2. 详细的研究描述（至少100字），包括研究动机、方法和潜在贡献
    3. 3-5个相关标签/关键词
    
    这些研究计划应该：
    - 代表不同研究角度和方法
    - 包含创新元素而非仅仅复述现有工作
    - 有明确的学术或实际价值
    - 可以作为研究项目或论文的基础
    
    以JSON格式输出，结构如下：
    [
      {
        "id": "1",
        "title": "...",
        "description": "...",
        "tags": ["标签1", "标签2", "..."]
      },
      ...更多计划
    ]
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
            temperature: 0.7,
            topP: 0.8,
            topK: 40,
            maxOutputTokens: 4096,
          }
        })
      });
      
      if (!response.ok) {
        throw new Error(`API响应错误: ${response.status}`);
      }
      
      const data = await response.json();
      const generatedText = data.candidates[0].content.parts[0].text;
      
      // 提取JSON
      const jsonMatch = generatedText.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('无法解析API返回的JSON');
      }
    } catch (error) {
      console.error('调用Gemini API失败:', error);
      throw error;
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* 头部导航 */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">
            <Link href="/">ResearchGPT</Link>
          </h1>
          <div className="w-1/2">
            <input
              type="text"
              defaultValue={query}
              placeholder="输入研究领域或关键词..."
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link href="/" className="hover:text-blue-500">
                  首页
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-500">
                  关于
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="flex-grow container mx-auto py-8 px-4">
        <h2 className="text-2xl font-bold mb-6">"{query}" 的研究计划</h2>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {researchPlans.map((plan) => (
              <Link href={`/plan/${encodeURIComponent(plan.title)}`} key={plan.id} className="block">
                <div className="modern-card h-full p-6 flex flex-col">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-blue-700 line-clamp-2">{plan.title}</h3>
                    <span className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full">
                      {plan.tags[0]}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-3">{plan.description}</p>
                  <div className="mt-auto">
                    <div className="inline-flex items-center text-sm text-blue-600 font-medium">
                      查看详情
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
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

// 页面组件使用Suspense包装内容组件
export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
} 