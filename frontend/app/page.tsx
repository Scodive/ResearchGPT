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
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600 flex items-center">
            <svg className="w-8 h-8 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
            <Link href="/">ResearchGPT</Link>
          </h1>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link href="/" className="hover:text-blue-500 text-blue-600 font-medium">首页</Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-blue-500 font-medium">研究探索</Link>
              </li>
              <li>
                <Link href="/paper" className="hover:text-blue-500 font-medium">AI论文生成</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-500 font-medium">关于</Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="flex-grow">
        {/* 英雄区域 */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 fancy-title">
              用AI发现研究空白，设计实验，撰写论文
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              ResearchGPT 是您的智能研究助手，从文献分析到实验设计，从研究差距发现到论文撰写，全流程加速您的研究工作。
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/search" className="gradient-button">
                开始研究探索
              </Link>
              <Link href="/paper" className="px-6 py-3 rounded-lg font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors duration-300">
                生成研究论文
              </Link>
            </div>
          </div>
        </div>
        
        {/* 特性展示区 */}
        <div className="py-16 container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">智能研究流程</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="modern-card p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">发现研究空白</h3>
              <p className="text-gray-600">利用AI智能分析大量文献，快速识别研究领域中的空白点和潜在机会。</p>
            </div>
            
            <div className="modern-card p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">设计实验方案</h3>
              <p className="text-gray-600">根据研究目标自动生成详细的实验设计，包括方法、步骤和预期结果。</p>
            </div>
            
            <div className="modern-card p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">撰写研究论文</h3>
              <p className="text-gray-600">AI辅助生成学术论文，支持IEEE格式，自动构建结构合理、内容专业的研究报告。</p>
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
            <div className="flex flex-col items-end">
              <p>© {new Date().getFullYear()} ResearchGPT. 保留所有权利。</p>
              <div className="mt-2 text-sm">
                <Link href="/about" className="text-gray-300 hover:text-white mr-4">
                  关于
                </Link>
                <Link href="/about#privacy" className="text-gray-300 hover:text-white">
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