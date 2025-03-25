import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '只支持POST请求' });
  }

  try {
    const { topic, language = 'english' } = req.body;
    
    if (!topic || typeof topic !== 'string') {
      return res.status(400).json({ message: '请提供有效的研究主题' });
    }
    
    // 使用本地生成的模板，不调用外部API
    const title = language === 'english' 
      ? `Advanced Research on ${topic}: Current Status and Future Directions`
      : `${topic}的进展研究：现状与未来方向`;
    
    // 生成示例LaTeX内容
    const latex = generateSampleLatex(topic, title, language);
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    res.status(200).json({ title, latex });
  } catch (error) {
    console.error('论文生成错误:', error);
    res.status(500).json({ message: '生成论文失败', error: String(error) });
  }
}

// 生成示例LaTeX内容
function generateSampleLatex(topic: string, title: string, language: string) {
  if (language === 'english') {
    return `\\documentclass[conference]{IEEEtran}
\\usepackage{cite}
\\usepackage{amsmath,amssymb,amsfonts}
\\usepackage{algorithmic}
\\usepackage{graphicx}
\\usepackage{textcomp}
\\usepackage{xcolor}
\\def\\BibTeX{{\\rm B\\kern-.05em{\\sc i\\kern-.025em b}\\kern-.08em
    T\\kern-.1667em\\lower.7ex\\hbox{E}\\kern-.125emX}}
\\begin{document}

\\title{${title}}

\\author{\\IEEEauthorblockN{ResearchGPT}
\\IEEEauthorblockA{\\textit{AI Research Assistant} \\\\
\\textit{Automated Academic Writing}\\\\
research-gpt@example.com}}

\\maketitle

\\begin{abstract}
This paper presents a comprehensive review of recent advancements in ${topic}. 
We discuss the current state of research, identify key challenges, and propose potential 
directions for future work. Our analysis reveals that ${topic} is a rapidly evolving field 
with significant implications for scientific progress and practical applications.
\\end{abstract}

\\begin{IEEEkeywords}
${topic}, research, artificial intelligence, review
\\end{IEEEkeywords}

\\section{Introduction}
${topic} has emerged as a significant area of research in recent years, attracting 
attention from both academia and industry. The growing interest in this field is 
driven by its potential to revolutionize various aspects of science and technology.

\\section{Background}
\\subsection{Historical Development}
The evolution of ${topic} can be traced back to early works in the field. Initial 
research focused primarily on theoretical foundations, gradually transitioning to 
more practical applications as the technology matured.

\\subsection{Theoretical Foundations}
The theoretical underpinnings of ${topic} draw from multiple disciplines, including 
mathematics, computer science, and domain-specific knowledge.

\\section{Current Research}
\\subsection{Key Approaches}
Research in ${topic} has led to the development of several key approaches:
\\begin{itemize}
    \\item Approach 1: Description of the first major research direction
    \\item Approach 2: Description of the second major research direction
    \\item Approach 3: Description of the third major research direction
\\end{itemize}

\\subsection{Recent Advancements}
Recent years have witnessed significant progress in ${topic}, with notable 
advancements in:
\\begin{itemize}
    \\item Performance improvements through novel algorithms
    \\item Expanding application domains
    \\item Integration with complementary technologies
\\end{itemize}

\\section{Challenges and Opportunities}
Despite the progress, several challenges remain in ${topic}:
\\begin{itemize}
    \\item Challenge 1: Description of a major unsolved problem
    \\item Challenge 2: Description of a technical limitation
    \\item Challenge 3: Description of a practical implementation issue
\\end{itemize}

These challenges present opportunities for future research and innovation.

\\section{Future Directions}
Based on our analysis, we identify several promising directions for future research:
\\begin{itemize}
    \\item Direction 1: Potential research focus area
    \\item Direction 2: Another potential research focus area
    \\item Direction 3: A third potential research focus area
\\end{itemize}

\\section{Conclusion}
In this paper, we have presented a comprehensive review of ${topic}. Our analysis 
highlights the significant progress made in this field, as well as the challenges 
that remain to be addressed. The future of ${topic} appears promising, with ample 
opportunities for innovative research and practical applications.

\\begin{thebibliography}{00}
\\bibitem{b1} Author1, Author2, "Title of the first paper," Journal Name, vol. 1, no. 1, pp. 1-10, 2023.
\\bibitem{b2} Author3, Author4, "Title of the second paper," Proceedings of Conference, pp. 11-20, 2022.
\\bibitem{b3} Author5, "Title of the third paper," Journal Name, vol. 2, no. 2, pp. 21-30, 2021.
\\end{thebibliography}

\\end{document}`;
  } else {
    return `\\documentclass[conference]{IEEEtran}
\\usepackage{cite}
\\usepackage{amsmath,amssymb,amsfonts}
\\usepackage{algorithmic}
\\usepackage{graphicx}
\\usepackage{textcomp}
\\usepackage{xcolor}
\\def\\BibTeX{{\\rm B\\kern-.05em{\\sc i\\kern-.025em b}\\kern-.08em
    T\\kern-.1667em\\lower.7ex\\hbox{E}\\kern-.125emX}}
\\begin{document}

\\title{${title}}

\\author{\\IEEEauthorblockN{ResearchGPT}
\\IEEEauthorblockA{\\textit{智能研究助手} \\\\
\\textit{自动化学术写作}\\\\
research-gpt@example.com}}

\\maketitle

\\begin{abstract}
本文对${topic}领域的最新进展进行了全面综述。我们讨论了当前的研究状态，
识别了关键挑战，并提出了未来工作的潜在方向。我们的分析表明，${topic}是一个
快速发展的领域，对科学进步和实际应用具有重要意义。
\\end{abstract}

\\begin{IEEEkeywords}
${topic}，研究，人工智能，综述
\\end{IEEEkeywords}

\\section{引言}
${topic}近年来已成为一个重要的研究领域，吸引了学术界和产业界的广泛关注。
对这一领域的日益增长的兴趣源于其在革新科学技术各个方面的潜力。

\\section{背景}
\\subsection{历史发展}
${topic}的演变可以追溯到该领域的早期工作。最初的研究主要集中在理论基础上，
随着技术的成熟，逐渐过渡到更实用的应用。

\\subsection{理论基础}
${topic}的理论基础源自多个学科，包括数学、计算机科学和特定领域知识。

\\section{当前研究}
\\subsection{关键方法}
${topic}的研究已经导致了几种关键方法的发展：
\\begin{itemize}
    \\item 方法1：第一个主要研究方向的描述
    \\item 方法2：第二个主要研究方向的描述
    \\item 方法3：第三个主要研究方向的描述
\\end{itemize}

\\subsection{最新进展}
近年来，${topic}取得了显著进展，主要表现在：
\\begin{itemize}
    \\item 通过新颖算法提高性能
    \\item 扩展应用领域
    \\item 与互补技术的集成
\\end{itemize}

\\section{挑战与机遇}
尽管取得了进展，${topic}仍面临着几个挑战：
\\begin{itemize}
    \\item 挑战1：一个主要未解决问题的描述
    \\item 挑战2：技术限制的描述
    \\item 挑战3：实际实施问题的描述
\\end{itemize}

这些挑战为未来的研究和创新提供了机会。

\\section{未来方向}
基于我们的分析，我们确定了未来研究的几个有前途的方向：
\\begin{itemize}
    \\item 方向1：潜在研究重点领域
    \\item 方向2：另一个潜在研究重点领域
    \\item 方向3：第三个潜在研究重点领域
\\end{itemize}

\\section{结论}
在本文中，我们对${topic}进行了全面综述。我们的分析强调了该领域取得的显著进展，
以及仍需解决的挑战。${topic}的未来看起来很有希望，有充分的机会进行创新研究和实际应用。

\\begin{thebibliography}{00}
\\bibitem{b1} 作者1, 作者2, "第一篇论文标题," 期刊名称, 卷1, 期1, 页1-10, 2023.
\\bibitem{b2} 作者3, 作者4, "第二篇论文标题," 会议论文集, 页11-20, 2022.
\\bibitem{b3} 作者5, "第三篇论文标题," 期刊名称, 卷2, 期2, 页21-30, 2021.
\\end{thebibliography}

\\end{document}`;
  }
} 