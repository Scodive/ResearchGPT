'use client';

import React from 'react';
import Link from 'next/link';

export default function About() {
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
                <Link href="/about" className="hover:text-blue-500 text-blue-600 font-medium">关于</Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-3xl font-bold mb-6 text-center fancy-title">关于 ResearchGPT</h2>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3">项目简介</h3>
            <p className="text-gray-700 mb-4">
              ResearchGPT是一个智能研究助手，旨在帮助研究人员分析文献、发现研究空白、设计实验和撰写论文。
              该项目利用人工智能技术，特别是生成式大型语言模型，为学术研究提供智能辅助工具。
            </p>
            <p className="text-gray-700">
              本项目仅为演示和研究目的而创建，旨在探索AI在学术研究领域的应用潜力。
            </p>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3">项目代码库</h3>
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <svg className="w-8 h-8 text-gray-700 mr-3" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"/>
              </svg>
              <div>
                <p className="font-medium">项目源代码托管在GitHub上：</p>
                <a 
                  href="https://github.com/Scodive/ResearchGPT" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  github.com/Scodive/ResearchGPT
                </a>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3">联系方式</h3>
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <svg className="w-8 h-8 text-gray-700 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              <div>
                <p className="font-medium">如有问题或建议，请联系：</p>
                <a 
                  href="mailto:hjiangbg@connect.ust.hk" 
                  className="text-blue-600 hover:underline"
                >
                  hjiangbg@connect.ust.hk
                </a>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
            <h3 className="text-xl font-semibold mb-3 text-blue-800">隐私协议与免责声明</h3>
            <div className="text-gray-700 space-y-3">
              <p>
                <strong>使用条款：</strong> ResearchGPT仅供研究、学习和参考目的使用。本工具生成的内容不应作为最终的学术成果直接使用，用户应对生成内容进行验证和修改。
              </p>
              <p>
                <strong>数据使用：</strong> 我们可能会匿名收集用户查询和使用数据，用于改进服务质量。我们不会收集个人识别信息，除非用户主动提供用于特定功能。
              </p>
              <p>
                <strong>免责声明：</strong> ResearchGPT由AI技术驱动，可能会产生不准确、不完整或不合适的内容。我们不对生成内容的准确性、完整性或适用性做任何保证，也不对用户基于该内容做出的任何决定负责。
              </p>
              <p>
                <strong>第三方内容：</strong> ResearchGPT可能引用或参考第三方内容。我们尊重知识产权，建议用户在使用时进行适当引用和遵守相关版权法律。
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