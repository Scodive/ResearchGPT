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
      // 模拟API调用，获取研究计划
      setTimeout(() => {
        // 这里应该是实际的API调用
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
      }, 1500);
    }
  }, [query]);

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
          <div className="grid grid-cols-1 gap-6">
            {researchPlans.map((plan) => (
              <Link href={`/plan/${plan.id}`} key={plan.id}>
                <div className="research-card">
                  <h3 className="text-xl font-semibold mb-2">{plan.title}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {plan.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
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