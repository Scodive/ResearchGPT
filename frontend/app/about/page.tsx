'use client';

import React from 'react';
import Link from 'next/link';
// Consider importing Image from next/image if you haven't moved the image yet
// import Image from 'next/image';

export default function AboutPage() { // Renamed component to follow convention
  return (
    <div className="min-h-screen flex flex-col bg-gray-50"> {/* Consistent page background */}
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
               <li><Link href="/search" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-100">研究探索</Link></li>
               <li><Link href="/paper" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-100">AI论文生成</Link></li>
               <li><Link href="/about" className="px-3 py-2 rounded-md text-sm font-medium text-blue-600 bg-blue-50">关于</Link></li> {/* Highlight current page */}
             </ul>
           </nav>
         </div>
       </header>

      {/* 主内容区 - Increased padding */}
      <main className="flex-grow container mx-auto py-16 md:py-20 px-6">
        {/* Enhanced Card Styling */}
        <div className="max-w-4xl mx-auto bg-white p-8 md:p-10 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center text-gray-900 fancy-title">关于 ResearchGPT</h2>

          {/* Section Styling */}
          <section className="mb-10 pb-8 border-b border-gray-200">
            <h3 className="text-2xl font-semibold mb-5 text-gray-800">项目简介</h3>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                ResearchGPT 旨在成为研究人员与学生的智能伙伴，利用 Google Gemini 等先进 AI 技术，在学术研究的各个环节提供支持——从高效分析海量文献、精准识别研究空白，到构思实验设计，乃至辅助撰写符合规范的论文初稿。
              </p>
              <p>
                我们的目标是借助 AI 的力量，降低研究门槛，激发创新思维火花，加速知识发现与传播的进程。目前项目仍处于早期演示和迭代阶段，持续探索 AI 在学术研究领域的无限潜力。
              </p>
            </div>
          </section>

          {/* GitHub and Contact Section */}
          <section className="mb-10 pb-8 border-b border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* GitHub */}
             <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">项目代码库</h3>
                <div className="flex items-start p-5 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
                  <svg className="w-10 h-10 text-gray-600 mr-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"/> </svg>
                  <div>
                    <p className="font-medium text-gray-700 mb-1">源代码托管于 GitHub:</p>
                    <a
                      href="https://github.com/Scodive/ResearchGPT"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all text-sm" // Added break-all
                    >
                      github.com/Scodive/ResearchGPT
                    </a>
                  </div>
                </div>
             </div>
             {/* Contact */}
             <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">联系方式</h3>
                <div className="flex items-start p-5 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
                  <svg className="w-10 h-10 text-gray-600 mr-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path> </svg>
                  <div>
                    <p className="font-medium text-gray-700 mb-1">问题或建议请联系:</p>
                    <a
                      href="mailto:hjiangbg@connect.ust.hk"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      hjiangbg@connect.ust.hk
                    </a>
                  </div>
                </div>
             </div>
          </section>

          {/* Support and Feedback Section - Added id="support" */}
          <section id="support" className="mb-10 pb-8 border-b border-gray-200 text-center"> {/* Centered text */}
            <h3 className="text-2xl font-semibold mb-5 text-gray-800">支持与反馈</h3>
            <p className="text-gray-700 mb-6 leading-relaxed max-w-xl mx-auto"> {/* Centered and max-width */}
              若 ResearchGPT 对您的研究或学习有所助益，诚邀您考虑<span className="font-medium text-indigo-600">赞助</span>支持项目的持续维护与迭代。您的点滴支持，将是项目不断完善的莫大动力！同时，我们热切期待您分享宝贵的<span className="font-medium text-indigo-600">功能建议</span>与<span className="font-medium text-indigo-600">使用反馈</span>。
            </p>
            <div className="flex justify-center mb-6">
              {/* Ensure image is in public folder */}
              <img
                src="/IMG_6680.JPG" // Correct path relative to /public
                alt="赞助二维码"
                width={200} // Slightly smaller width
                height={200} // Slightly smaller height
                className="rounded-lg shadow-md border border-gray-200"
              />
              {/* If using next/image: */}
              {/* <Image src="/IMG_6680.JPG" alt="赞助二维码" width={200} height={200} className="rounded-lg shadow-md border border-gray-200" /> */}
            </div>
          </section>

          {/* Privacy Policy Section */}
          <section id="privacy" className="bg-blue-50 p-6 md:p-8 rounded-lg border border-blue-100"> {/* Added ID for potential linking */}
            <h3 className="text-2xl font-semibold mb-5 text-blue-800">隐私协议与免责声明</h3>
            <div className="space-y-4 text-gray-700 text-sm leading-relaxed"> {/* Smaller text, more spacing */}
              <p>
                <strong className="font-medium text-gray-800">使用条款：</strong> ResearchGPT 旨在提供学习、研究与参考辅助。由 AI 生成的内容可能包含不准确之处，不应被视为最终学术定论。用户需自行审慎判断、验证和修改，并对最终成果负责。
              </p>
              <p>
                <strong className="font-medium text-gray-800">数据使用：</strong> 为持续改进服务，我们可能匿名化收集用户与本应用的交互数据（如查询类型、功能使用频率）。我们承诺不收集可直接识别个人的信息，除非用户为特定目的主动提供。
              </p>
              <p>
                <strong className="font-medium text-gray-800">免责声明：</strong> ResearchGPT 由大型语言模型驱动，其输出可能存在错误、遗漏或偏见。我们不对生成内容的准确性、完整性、时效性或特定用途适用性作任何明示或暗示的保证。用户基于本工具内容所做的任何决策或行动，其后果由用户自行承担。
              </p>
              <p>
                <strong className="font-medium text-gray-800">知识产权：</strong> 本工具可能引用第三方信息。我们尊重知识产权，建议用户在合理使用范围内，遵循相关版权法规，并对引用的内容进行恰当署名。
              </p>
            </div>
          </section>
        </div>
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
                 {/* Note: About link might not be needed here, but keeping for consistency */}
                 <Link href="/about" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">关于我们</Link>
                 <span className="text-gray-500">|</span>
                 {/* Link to the section ID */}
                 <Link href="/about#privacy" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">隐私政策</Link>
               </div>
             </div>
           </div>
         </div>
       </footer>
    </div>
  );
} 