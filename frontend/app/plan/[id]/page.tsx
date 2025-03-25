'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// 研究计划详细信息类型
interface ResearchPlanDetail {
  id: string;
  title: string;
  description: string;
  background: string;
  methodology: string;
  expectedResults: string;
  timeline: {
    phase: string;
    duration: string;
    activities: string[];
  }[];
  resources: string[];
  tags: string[];
}

export default function PlanDetail() {
  const params = useParams();
  const id = params.id as string;
  const [isLoading, setIsLoading] = useState(true);
  const [plan, setPlan] = useState<ResearchPlanDetail | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // 模拟API调用，获取研究计划详情
    setTimeout(() => {
      // 这里应该是实际的API调用
      const mockPlan: ResearchPlanDetail = {
        id,
        title: '人工智能领域中深度学习新方法的研究',
        description: '通过改进现有深度学习架构，解决当前AI领域中的性能瓶颈问题',
        background: `深度学习在过去几年取得了巨大的进展，但在处理复杂、非结构化数据时仍然面临挑战。
          现有研究表明，注意力机制和图神经网络在提高模型性能方面有很大潜力，但这两者的结合尚未得到充分探索。
          
          本研究旨在开发一种新的深度学习架构，结合注意力机制和图神经网络，以提高模型在处理复杂数据时的性能。`,
        methodology: `本研究将采用以下方法：
          
          1. 文献综述：全面梳理现有的注意力机制和图神经网络研究，识别潜在的结合点
          2. 模型设计：设计一种新的深度学习架构，将注意力机制与图神经网络结合
          3. 实验评估：在多个数据集上评估所提出的模型，包括图像分类、自然语言处理和图数据分析
          4. 比较分析：与现有的最先进模型进行比较，分析性能差异和改进空间`,
        expectedResults: `预期该研究将产生以下成果：
          
          1. 一种新的深度学习架构，结合注意力机制和图神经网络
          2. 在多个benchmark数据集上的性能评估结果
          3. 对模型性能的理论分析和解释
          4. 开源实现和文档，方便其他研究者复现和扩展`,
        timeline: [
          {
            phase: '阶段1：准备和文献综述',
            duration: '2个月',
            activities: [
              '收集和分析相关文献',
              '识别研究空白和机会',
              '制定详细的研究计划'
            ]
          },
          {
            phase: '阶段2：模型设计与实现',
            duration: '3个月',
            activities: [
              '设计新的深度学习架构',
              '实现模型原型',
              '进行初步测试和调整'
            ]
          },
          {
            phase: '阶段3：实验评估',
            duration: '4个月',
            activities: [
              '在多个数据集上评估模型性能',
              '与现有模型进行比较',
              '分析实验结果'
            ]
          },
          {
            phase: '阶段4：撰写论文和总结',
            duration: '3个月',
            activities: [
              '撰写研究论文',
              '准备开源代码和文档',
              '总结研究成果和未来方向'
            ]
          }
        ],
        resources: [
          '高性能计算资源（GPU集群）',
          '大规模数据集（如ImageNet、COCO、GLUE等）',
          '开源深度学习框架（PyTorch或TensorFlow）',
          '图数据处理库（如DGL或PyG）'
        ],
        tags: ['深度学习', '注意力机制', '图神经网络', '人工智能']
      };
      setPlan(mockPlan);
      setIsLoading(false);
    }, 1000);
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-xl">研究计划未找到</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* 头部导航 */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">
            <Link href="/">ResearchGPT</Link>
          </h1>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link href="/" className="hover:text-blue-500">
                  首页
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-500">
                  关于
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">{plan.title}</h2>
          <p className="text-xl text-gray-600 mb-4">{plan.description}</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {plan.tags.map((tag) => (
              <span
                key={tag}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* 选项卡导航 */}
          <div className="border-b mb-6">
            <nav className="flex space-x-8">
              <button
                className={`py-4 px-1 ${
                  activeTab === 'overview'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('overview')}
              >
                概述
              </button>
              <button
                className={`py-4 px-1 ${
                  activeTab === 'methodology'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('methodology')}
              >
                研究方法
              </button>
              <button
                className={`py-4 px-1 ${
                  activeTab === 'timeline'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('timeline')}
              >
                时间安排
              </button>
              <button
                className={`py-4 px-1 ${
                  activeTab === 'resources'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('resources')}
              >
                所需资源
              </button>
            </nav>
          </div>

          {/* 内容区 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            {activeTab === 'overview' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">研究背景</h3>
                <div className="whitespace-pre-line mb-6">{plan.background}</div>
                <h3 className="text-xl font-semibold mb-4">预期成果</h3>
                <div className="whitespace-pre-line">{plan.expectedResults}</div>
              </div>
            )}

            {activeTab === 'methodology' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">研究方法</h3>
                <div className="whitespace-pre-line">{plan.methodology}</div>
              </div>
            )}

            {activeTab === 'timeline' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">研究时间表</h3>
                <div className="space-y-6">
                  {plan.timeline.map((phase, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <h4 className="text-lg font-semibold">{phase.phase}</h4>
                      <p className="text-gray-600 mb-2">预计时长: {phase.duration}</p>
                      <ul className="list-disc list-inside space-y-1">
                        {phase.activities.map((activity, actIndex) => (
                          <li key={actIndex}>{activity}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'resources' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">所需资源</h3>
                <ul className="list-disc list-inside space-y-2">
                  {plan.resources.map((resource, index) => (
                    <li key={index}>{resource}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 mb-4">
          <h3 className="text-xl font-semibold mb-4">与AI讨论这个研究计划</h3>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-4 max-h-80 overflow-y-auto border rounded-lg p-4">
              <div className="space-y-4">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <p className="font-semibold text-gray-600">ResearchGPT</p>
                  <p>我已经为您生成了一个研究计划。您对这个计划有什么问题或建议？</p>
                </div>
                {/* 这里可以添加更多对话内容 */}
              </div>
            </div>
            <div className="flex">
              <input
                type="text"
                placeholder="输入您的问题或建议..."
                className="flex-grow px-4 py-2 rounded-l-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-r-lg">
                发送
              </button>
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