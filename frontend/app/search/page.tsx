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
  const [searchQuery, setSearchQuery] = useState(query);
  const [isLoading, setIsLoading] = useState(false);
  const [researchPlans, setResearchPlans] = useState<ResearchPlan[]>([]);

  useEffect(() => {
    if (query) {
      setSearchQuery(query);
    }
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    // 使用Gemini API生成研究计划
    generateResearchPlans(searchQuery)
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
            title: `${searchQuery}领域中深度学习新方法的研究`,
            description: `通过改进现有深度学习架构，解决当前${searchQuery}领域中的性能瓶颈问题`,
            tags: ['深度学习', '人工智能', searchQuery],
          },
          {
            id: '2',
            title: `基于知识图谱的${searchQuery}数据分析框架`,
            description: `构建专门针对${searchQuery}领域的知识图谱，提高数据关联分析效率`,
            tags: ['知识图谱', '数据分析', searchQuery],
          },
          {
            id: '3',
            title: `${searchQuery}领域中的不确定性量化研究`,
            description: `研究${searchQuery}中的不确定性来源并提出量化方法，提高模型可解释性`,
            tags: ['不确定性', '可解释AI', searchQuery],
          },
        ];
        setResearchPlans(mockPlans);
        setIsLoading(false);
      });
  };

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
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">
            <Link href="/">ResearchGPT</Link>
          </h1>
          <nav>
            <ul className="flex space-x-4 md:space-x-6">
              <li>
                <Link href="/" className="hover:text-blue-500">首页</Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-blue-500 text-blue-600 font-medium">研究探索</Link>
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
        {/* 搜索区域 - 移到主内容区顶部 */}
        <div className="max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">探索研究方向</h2>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="输入研究领域或关键词..."
                className="flex-grow px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
              <button 
                type="submit"
                className="w-full md:w-auto px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center shadow-sm"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    生成中...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    探索
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* 研究计划列表 */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : researchPlans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {researchPlans.map(plan => (
              <Link href={`/plan/${encodeURIComponent(plan.title)}`} key={plan.id}>
                <div className="modern-card h-full p-6 hover:transform hover:scale-[1.02] transition-all duration-300">
                  <div className="flex flex-col h-full">
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2">
                        {plan.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3 text-sm md:text-base">
                        {plan.description}
                      </p>
                    </div>
                    <div className="mt-auto">
                      <div className="flex flex-wrap gap-2">
                        {plan.tags.map((tag, index) => (
                          <span 
                            key={index}
                            className="bg-blue-50 text-blue-600 text-xs px-2.5 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <p className="text-lg text-gray-600 mb-4">
                输入您感兴趣的研究领域，点击"探索"按钮生成研究计划
              </p>
              {query && (
                <p className="text-gray-500">
                  未找到与"{query}"相关的研究计划
                </p>
              )}
            </div>
          </div>
        )}
      </main>

      {/* 底部 */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">ResearchGPT</h3>
              <p className="text-gray-300">智能研究助手</p>
            </div>
            <div className="flex flex-col items-center md:items-end">
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