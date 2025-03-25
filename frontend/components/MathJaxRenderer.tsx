'use client';

import React, { useEffect } from 'react';

interface MathJaxRendererProps {
  content: string;
}

declare global {
  interface Window {
    MathJax: any;
  }
}

export default function MathJaxRenderer({ content }: MathJaxRendererProps) {
  useEffect(() => {
    // 加载MathJax
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
    script.async = true;
    script.onload = () => {
      // 配置MathJax
      window.MathJax = {
        tex: {
          inlineMath: [['$', '$'], ['\\(', '\\)']],
          displayMath: [['$$', '$$'], ['\\[', '\\]']],
          processEscapes: true,
        },
        svg: {
          fontCache: 'global',
        },
      };

      // 渲染公式
      if (window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise();
      }
    };
    document.head.appendChild(script);

    return () => {
      // 清理
      document.head.removeChild(script);
    };
  }, [content]);

  return (
    <div className="math-content" dangerouslySetInnerHTML={{ __html: content }}></div>
  );
} 