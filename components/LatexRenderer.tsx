'use client';

import React, { useEffect } from 'react';

interface LatexRendererProps {
  content: string;
}

export function LatexRenderer({ content }: LatexRendererProps) {
  useEffect(() => {
    // 添加 KaTeX CSS
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.css';
    document.head.appendChild(linkElement);
    
    // 加载 KaTeX 脚本
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.js';
    script.defer = true;
    script.onload = () => {
      const container = document.getElementById('latex-preview-container');
      if (container && window.katex) {
        try {
          // 简单处理内容
          container.innerHTML = `<pre class="text-sm font-mono whitespace-pre-wrap">${content}</pre>`;
        } catch (e) {
          console.error('渲染LaTeX时出错:', e);
          container.innerHTML = `<pre class="text-sm font-mono whitespace-pre-wrap">${content}</pre>`;
        }
      }
    };
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(linkElement);
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [content]);

  return <div id="latex-preview-container" className="latex-preview"></div>;
} 