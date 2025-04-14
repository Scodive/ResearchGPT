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
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* 头部导航 */}
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
        <div className="container mx-auto py-4 px-6 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors duration-200">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
            <span className="text-2xl font-bold">ResearchGPT</span>
          </Link>
          <nav>
            <ul className="flex space-x-4 md:space-x-6 items-center">
              <li>
                <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium text-blue-600 bg-blue-50 transition-colors duration-200">首页</Link>
              </li>
              <li>
                <Link href="/search" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors duration-200">研究探索</Link>
              </li>
              <li>
                <Link href="/paper" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors duration-200">AI论文生成</Link>
              </li>
              <li>
                <Link href="/about" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors duration-200">关于</Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="flex-grow">
        {/* 英雄区域 */}
        <div className="bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 py-20 md:py-28">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-gray-900 leading-tight fancy-title">
              用AI加速您的学术研究之旅
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-3xl mx-auto">
              从文献分析到论文撰写，ResearchGPT 提供全流程智能支持，助您高效发现、设计与创造。
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link href="/search" className="gradient-button text-lg px-8 py-4">
                开始探索研究
              </Link>
              <Link href="/paper" className="text-lg px-8 py-4 rounded-lg font-medium text-blue-600 bg-white border border-blue-200 hover:bg-blue-50 hover:shadow-sm transition-all duration-300">
                直接生成论文
              </Link>
            </div>
          </div>
        </div>
        
        {/* 特性展示区 */}
        <div className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center text-gray-800">核心功能一览</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-5 ring-4 ring-blue-50">
                  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">发现研究空白</h3>
                <p className="text-gray-600 leading-relaxed">
                  智能分析海量文献，精准定位研究领域的前沿缺口与潜在创新点。
                </p>
              </div>
              
              <div className="bg-gray-50 p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-5 ring-4 ring-green-50">
                  <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">设计研究计划</h3>
                <p className="text-gray-600 leading-relaxed">
                  根据您的目标，AI 自动生成结构完整、逻辑清晰的研究计划和实验方案。
                </p>
              </div>
              
              <div className="bg-gray-50 p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-5 ring-4 ring-purple-50">
                  <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">撰写学术论文</h3>
                <p className="text-gray-600 leading-relaxed">
                  AI 辅助生成符合学术规范的论文初稿，支持多种格式，大幅提高写作效率。
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 底部 */}
      <footer className="bg-gray-900 text-gray-300 py-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold text-white">ResearchGPT</h3>
              <p className="text-sm">智能研究，探索无限</p>
            </div>
            <div className="flex flex-col items-center md:items-end">
              <p className="text-sm mb-2">© {new Date().getFullYear()} ResearchGPT. All Rights Reserved.</p>
              <div className="flex space-x-4">
                <Link href="/about" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                  关于我们
                </Link>
                <span className="text-gray-500">|</span>
                <Link href="/about#privacy" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                  隐私政策
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 