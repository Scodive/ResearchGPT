import type { NextApiRequest, NextApiResponse } from 'next';
import { LLMService } from '../../services/llm_service';

const llmService = new LLMService();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '只支持POST请求' });
  }

  try {
    const { query } = req.body;
    const researchPlans = await llmService.generateResearchPlans(query);
    res.status(200).json(researchPlans);
  } catch (error) {
    res.status(500).json({ message: '生成研究计划失败', error: String(error) });
  }
} 