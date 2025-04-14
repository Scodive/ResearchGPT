import React, { Suspense } from 'react';
import Link from 'next/link';
import SearchClientComponent from './SearchClientComponent';

// Define a simple loading fallback component
function LoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center text-center mt-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500 mb-4"></div>
      <p className="text-lg text-gray-600">加载搜索界面...</p>
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
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
              <li><Link href="/about" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-100">关于</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto py-16 md:py-20 px-6 flex flex-col items-center">
        <Suspense fallback={<LoadingFallback />}>
          <SearchClientComponent />
        </Suspense>
      </main>

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