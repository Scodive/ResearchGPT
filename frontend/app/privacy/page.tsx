'use client';

import React from 'react';
import Link from 'next/link';

export default function Privacy() {
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
              <li><Link href="/" className="hover:text-blue-500">首页</Link></li>
              <li><Link href="/search" className="hover:text-blue-500">研究探索</Link></li>
              <li><Link href="/paper" className="hover:text-blue-500">AI论文生成</Link></li>
              <li><Link href="/diagram" className="hover:text-blue-500">AI图表生成</Link></li>
              <li><Link href="/about" className="hover:text-blue-500">关于</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-3xl font-bold mb-6 text-center fancy-title">隐私协议与免责声明</h2>
          
          <div className="prose prose-blue max-w-none">
            <h3>1. 引言</h3>
            <p>
              ResearchGPT（"我们"，"我们的"）尊重您的隐私，并致力于保护您的个人信息。本隐私协议阐明了我们在您使用ResearchGPT服务时如何收集、使用和保护您的信息。
            </p>
            
            <h3>2. 信息收集</h3>
            <p>
              在使用ResearchGPT服务过程中，我们可能会收集以下信息：
            </p>
            <ul>
              <li><strong>研究查询：</strong> 您输入的研究主题和关键词</li>
              <li><strong>生成内容：</strong> 系统基于您的查询生成的研究计划和论文</li>
              <li><strong>使用数据：</strong> 您与服务交互的方式和频率</li>
            </ul>
            
            <h3>3. 信息使用</h3>
            <p>
              我们收集的信息将用于以下目的：
            </p>
            <ul>
              <li>提供、维护和改进我们的服务</li>
              <li>开发新功能和提高生成内容的质量</li>
              <li>进行研究以提升人工智能在学术领域的应用</li>
            </ul>
            
            <h3>4. 信息共享</h3>
            <p>
              我们不会出售或出租您的个人信息给第三方。但我们可能在以下情况下共享您的信息：
            </p>
            <ul>
              <li>在法律要求的情况下</li>
              <li>保护ResearchGPT的权利和安全</li>
              <li>与我们的服务提供商合作，如云服务提供商（这些提供商受保密义务约束）</li>
            </ul>
            
            <h3>5. 数据安全</h3>
            <p>
              我们采取合理的安全措施保护您的信息不被未授权访问、使用或披露。
            </p>
            
            <h3>6. 免责声明</h3>
            <p>
              ResearchGPT是一个利用人工智能技术的辅助工具，旨在帮助研究人员提高效率。请注意：
            </p>
            <ul>
              <li>生成的内容仅供参考，不保证其准确性、完整性或适用性</li>
              <li>用户应对生成的内容进行验证和审核</li>
              <li>我们不对用户基于生成内容所做的任何决定或行动负责</li>
              <li>本服务不应被用于抄袭或生成学术不端内容</li>
            </ul>
            
            <h3>7. 知识产权</h3>
            <p>
              ResearchGPT生成的内容可能包含引用或参考现有学术文献。用户在使用这些内容时应：
            </p>
            <ul>
              <li>尊重知识产权并适当引用原始来源</li>
              <li>遵守学术诚信准则</li>
              <li>仅将生成内容用作起点或参考，而非最终成果</li>
            </ul>
            
            <h3>8. 联系方式</h3>
            <p>
              如您对本隐私协议有任何疑问或建议，请通过以下方式联系我们：
            </p>
            <p>
              <a href="mailto:hjiangbg@connect.ust.hk" className="text-blue-600 hover:underline">
                hjiangbg@connect.ust.hk
              </a>
            </p>
            
            <h3>9. 协议变更</h3>
            <p>
              我们可能会不时更新本隐私协议。当我们进行重大变更时，我们会在网站上发布通知。建议您定期查看本协议以了解最新信息。
            </p>
            
            <p className="mt-8 text-center text-gray-500">
              最后更新日期：{new Date().toISOString().split('T')[0]}
            </p>
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