'use client';

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// 研究方向卡片接口
interface ResearchIdea {
  id: number;
  title: string;
  description: string;
}

// 研究计划接口
interface Plan {
  id: string;
  title: string;
  description: string;
  tags: string[];
}

// 示例研究方向建议
const sampleIdeas: ResearchIdea[] = [
  { id: 1, title: '可持续能源存储技术', description: '探索新型电池材料和超级电容器，提高能量密度和循环寿命。' },
  { id: 2, title: 'AI在精准医疗中的应用', description: '利用机器学习预测疾病风险、辅助诊断和个性化治疗方案。' },
  { id: 3, title: '下一代无线通信（6G）', description: '研究太赫兹通信、智能反射面等关键技术，实现超高速率和低延迟。' },
  { id: 4, title: '碳捕获与利用技术', description: '开发高效、低成本的碳捕获材料和转化途径，应对气候变化。' },
  { id: 5, title: '脑机接口的伦理与应用', description: '探讨脑机接口在医疗康复、增强认知等领域的潜力及社会伦理挑战。' },
  { id: 6, title: '量子计算在药物发现中的应用', description: '利用量子算法模拟分子相互作用，加速新药研发过程。' },
];

export default function SearchPageWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    }>
      <SearchPage />
    </Suspense>
  )
}

function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Plan[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 处理 URL 参数，如果存在 q 参数则自动填充搜索框并触发搜索
  useEffect(() => {
    const queryParam = searchParams.get('q');
    if (queryParam) {
      setSearchQuery(queryParam);
      handleSearch(queryParam);
    }
  }, [searchParams]);

  // 搜索处理函数
  const handleSearch = async (query?: string) => {
    const currentQuery = query || searchQuery;
    if (!currentQuery.trim()) return;

    setIsLoading(true);
    setError(null);
    setResults([]); // 清空旧结果

    try {
      const generatedPlans = await generateResearchPlans(currentQuery);
      setResults(generatedPlans);
    } catch (err) {
      setError('生成研究计划时出错，请稍后重试。');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 表单提交处理
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  // 点击建议卡片的处理函数
  const handleIdeaClick = (ideaTitle: string) => {
    setSearchQuery(ideaTitle);
    // 可选：自动触发搜索
    // handleSearch(ideaTitle);
  };


  // 使用Gemini API生成研究计划摘要
  async function generateResearchPlans(topic: string): Promise<Plan[]> {
    const API_KEY = 'AIzaSyDy9pYAEW7e2Ewk__9TCHAD5X_G1VhCtVw';
    const MODEL = 'gemini-2.5-flash-preview-05-20'; // 更新为正确的模型名称
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

    const prompt = `针对研究主题 "${topic}"，生成 3 个创新且具体的研究方向计划摘要。每个计划摘要应包含：
    - id: 唯一标识符 (例如， "plan-1", "plan-2", "plan-3")
    - title: 一个简洁、吸引人的研究方向标题 (中文)
    - description: 对该研究方向的简短描述 (中文, 约 50-80 字)
    - tags: 3-4 个相关的关键词标签 (中文)

    确保输出是有效的 JSON 数组格式，包含 3 个计划对象。不要包含任何其他文本或解释，只返回 JSON 数组。`;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7, // 稍高温度以获得更多创意
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 2048, // 足够生成3个摘要
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API 响应错误: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates[0].content.parts[0].text;

    // 提取 JSON 数组
    const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (e) {
         console.error("解析JSON失败:", e, "原始文本:", generatedText);
         throw new Error('无法解析API返回的JSON数组');
      }
    } else {
      console.error("未找到JSON数组:", generatedText);
      throw new Error('API未返回有效的JSON数组格式');
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white"> {/* 添加渐变背景 */}
      {/* 头部导航 - Consistent */}
       <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
         <div className="container mx-auto py-4 px-6 flex justify-between items-center">
           <Link href="/" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors duration-200">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
             <span className="text-2xl font-bold">ResearchGPT</span>
           </Link>
           <nav>
             <ul className="flex space-x-4 md:space-x-6 items-center">
               <li><Link href="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-100">首页</Link></li>
               <li><Link href="/search" className="px-3 py-2 rounded-md text-sm font-medium text-blue-600 bg-blue-50">研究探索</Link></li>
               <li><Link href="/paper" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-100">AI论文生成</Link></li>
               <li><Link href="/diagram" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-100">AI图表生成</Link></li>
               <li><Link href="/about" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-100">关于</Link></li>
             </ul>
           </nav>
         </div>
       </header>

      {/* 主内容区 - 增加顶部内边距 */}
      <main className="flex-grow container mx-auto py-16 md:py-20 px-6 flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900 text-center">探索研究方向</h2>

        {/* 搜索表单 */}
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mb-12">
          <div className="flex items-center bg-white p-2 rounded-lg shadow-md border border-gray-200">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="输入您感兴趣的研究领域或关键词..."
              className="flex-grow px-4 py-3 border-none focus:outline-none focus:ring-0 text-base" // 简化输入框样式
              disabled={isLoading}
              aria-label="研究领域输入框"
            />
            <button
              type="submit"
              disabled={isLoading || !searchQuery.trim()}
              className={`px-6 py-3 rounded-md text-white font-medium transition-colors duration-200 flex items-center ${
                isLoading || !searchQuery.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading ? (
                 <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    探索中...
                 </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  探索
                </>
              )}
            </button>
          </div>
        </form>

        {/* 初始提示或建议卡片 */}
        {!isLoading && results.length === 0 && !error && (
          <div className="w-full max-w-4xl text-center mb-12">
            <p className="text-gray-600 mb-8 text-lg">
              输入您感兴趣的研究领域，点击"探索"按钮生成创新研究计划建议。
            </p>
            <h3 className="text-xl font-semibold mb-6 text-gray-700">或者，尝试一些热门方向：</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleIdeas.map((idea) => (
                <div
                  key={idea.id}
                  onClick={() => handleIdeaClick(idea.title)}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg border border-gray-100 cursor-pointer transition-all duration-200 transform hover:-translate-y-1"
                >
                  <h4 className="font-semibold text-blue-600 mb-2">{idea.title}</h4>
                  <p className="text-sm text-gray-600">{idea.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 加载状态 */}
        {isLoading && (
           <div className="flex flex-col items-center justify-center text-center mt-10">
             <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500 mb-4"></div>
             <p className="text-lg text-gray-600">正在为您生成研究方向建议...</p>
           </div>
        )}

        {/* 错误提示 */}
        {error && (
          <div className="mt-10 text-center text-red-600 bg-red-50 p-4 rounded-lg border border-red-200 w-full max-w-2xl">
             <p>{error}</p>
          </div>
        )}

        {/* 结果展示 */}
        {!isLoading && results.length > 0 && (
          <div className="w-full max-w-4xl mt-10">
            <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">为您生成的创新研究方向：</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((plan) => (
                <Link
                  key={plan.id}
                  href={`/plan/${encodeURIComponent(plan.title)}`} // 链接到详情页，传递标题
                  className="block bg-white p-6 rounded-lg shadow-lg hover:shadow-xl border border-gray-100 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <h4 className="text-lg font-semibold text-blue-700 mb-3">{plan.title}</h4>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">{plan.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {plan.tags.map((tag, index) => (
                       <span key={index} className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">
                         {tag}
                       </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* 底部 - Consistent */}
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