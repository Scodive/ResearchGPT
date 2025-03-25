import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { v4 as uuidv4 } from 'uuid';
import os from 'os';

export async function POST(request: NextRequest) {
  try {
    const { latex } = await request.json();
    
    if (!latex) {
      return NextResponse.json({ error: '没有提供LaTeX内容' }, { status: 400 });
    }
    
    // 创建临时目录
    const tempDir = path.join(os.tmpdir(), `latex-${uuidv4()}`);
    await fs.mkdir(tempDir, { recursive: true });
    
    // 写入LaTeX文件
    const texFilePath = path.join(tempDir, 'paper.tex');
    await fs.writeFile(texFilePath, latex);
    
    // 编译LaTeX为PDF (使用pdflatex)
    return new Promise((resolve, reject) => {
      exec(`pdflatex -interaction=nonstopmode -output-directory=${tempDir} ${texFilePath}`, async (error, stdout, stderr) => {
        if (error) {
          console.error('编译错误:', stderr);
          resolve(NextResponse.json({ error: '编译失败', details: stderr }, { status: 500 }));
          return;
        }
        
        try {
          // 读取生成的PDF
          const pdfPath = path.join(tempDir, 'paper.pdf');
          const pdfBuffer = await fs.readFile(pdfPath);
          
          // 清理临时文件
          try {
            await fs.rm(tempDir, { recursive: true, force: true });
          } catch (e) {
            console.error('清理临时文件失败:', e);
          }
          
          // 返回PDF
          const response = new NextResponse(pdfBuffer);
          response.headers.set('Content-Type', 'application/pdf');
          response.headers.set('Content-Disposition', 'inline; filename="paper.pdf"');
          resolve(response);
        } catch (err) {
          console.error('读取PDF失败:', err);
          resolve(NextResponse.json({ error: '处理PDF失败' }, { status: 500 }));
        }
      });
    });
  } catch (error) {
    console.error('服务器错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
} 