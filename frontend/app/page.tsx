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
      <main className="flex-grow">
        {/* 英雄区域 */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                用AI发现研究空白，设计实验，撰写论文
              </h2>
              <p className="text-xl md:text-2xl mb-8 text-blue-100">
                ResearchGPT帮助研究人员分析文献、发现未解决的问题、设计实验并撰写高质量论文
              </p>

              {/* 搜索表单 */}
              <form onSubmit={handleSearch} className="mb-12">
                <div className="flex flex-col md:flex-row shadow-lg rounded-lg overflow-hidden">
                  <input
                    type="text"
                    placeholder="输入研究领域或关键词，如：人工智能、机器学习、生物医学..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-grow px-6 py-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  />
                  <button
                    type="submit"
                    className="bg-blue-700 hover:bg-blue-800 transition-colors text-white px-8 py-4 text-lg font-semibold"
                  >
                    研究
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        {/* 特性介绍 */}
        <div className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-bold text-center mb-12">智能研究助手功能</h3>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="card hover:shadow-xl transition-shadow">
                <div className="mb-4 text-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">文献分析</h3>
                <p className="text-gray-600">
                  自动分析领域内最新文献，理解已有研究内容
                </p>
              </div>
              <div className="card hover:shadow-xl transition-shadow">
                <div className="mb-4 text-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">研究空白发现</h3>
                <p className="text-gray-600">
                  找到未解决的问题或现有方法的局限性
                </p>
              </div>
              <div className="card hover:shadow-xl transition-shadow">
                <div className="mb-4 text-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">实验设计</h3>
                <p className="text-gray-600">
                  生成可行的实验设计和详细研究计划
                </p>
              </div>
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