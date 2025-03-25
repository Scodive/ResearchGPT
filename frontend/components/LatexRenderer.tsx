'use client';

import React, { useEffect } from 'react';
import 'katex/dist/katex.min.css';
import { renderToString } from 'katex';

interface LatexRendererProps {
  content: string;
}

export function LatexRenderer({ content }: LatexRendererProps) {
  useEffect(() => {
    // 简单预处理 LaTeX 内容，以便显示数学公式
    const processedContent = processLatexForDisplay(content);
    const container = document.getElementById('latex-preview-container');
    if (container) {
      container.innerHTML = processedContent;
    }
  }, [content]);

  // 简化处理 LaTeX 用于预览
  function processLatexForDisplay(latex: string): string {
    // 将数学环境替换为可显示的HTML
    let processed = latex;
    
    // 处理行内数学公式 $...$
    processed = processed.replace(/\$([^$]+)\$/g, (match, formula) => {
      try {
        return renderToString(formula, { throwOnError: false, displayMode: false });
      } catch (e) {
        return match;
      }
    });
    
    // 处理行间数学公式 $$...$$
    processed = processed.replace(/\$\$([^$]+)\$\$/g, (match, formula) => {
      try {
        return renderToString(formula, { throwOnError: false, displayMode: true });
      } catch (e) {
        return match;
      }
    });
    
    // 添加语法高亮和格式
    processed = `<pre class="text-sm font-mono whitespace-pre-wrap">${processed}</pre>`;
    
    return processed;
  }

  return <div id="latex-preview-container" className="latex-preview"></div>;
} 