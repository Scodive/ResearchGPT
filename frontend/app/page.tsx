'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // 处理搜索逻辑，可以导航到搜索结果页面
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* 头部导航 */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">ResearchGPT</h1>
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
      <main className="flex-grow container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">
            用AI发现研究空白，设计实验，撰写论文
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            ResearchGPT帮助研究人员分析文献、发现未解决的问题、设计实验并撰写高质量论文
          </p>

          {/* 搜索表单 */}
          <form onSubmit={handleSearch} className="mb-12">
            <div className="flex">
              <input
                type="text"
                placeholder="输入研究领域或关键词，如：人工智能、机器学习、生物医学..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-grow px-4 py-3 rounded-l-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-r-lg"
              >
                研究
              </button>
            </div>
          </form>

          {/* 特性介绍 */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="card">
              <h3 className="text-xl font-semibold mb-3">文献分析</h3>
              <p className="text-gray-600">
                自动分析领域内最新文献，理解已有研究内容
              </p>
            </div>
            <div className="card">
              <h3 className="text-xl font-semibold mb-3">研究空白发现</h3>
              <p className="text-gray-600">
                找到未解决的问题或现有方法的局限性
              </p>
            </div>
            <div className="card">
              <h3 className="text-xl font-semibold mb-3">实验设计</h3>
              <p className="text-gray-600">
                生成可行的实验设计和详细研究计划
              </p>
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