from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
import uvicorn
from dotenv import load_dotenv

# 导入自定义模块
from app.services.llm_service import LLMService
from app.services.paper_service import PaperService
from app.models.research_models import (
    ResearchQuery,
    ResearchPlan,
    ResearchPlanDetail,
    ChatMessage
)

# 加载环境变量
load_dotenv()

app = FastAPI(
    title="ResearchGPT API",
    description="智能研究助手API，支持论文分析、研究空白发现、实验设计和论文撰写",
    version="0.1.0"
)

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 在生产环境中应该设置为前端域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 初始化服务
llm_service = LLMService()
paper_service = PaperService()

@app.get("/", tags=["健康检查"])
async def root():
    """API状态检查"""
    return {"status": "online", "message": "ResearchGPT API 服务正常运行"}

@app.post("/api/search", response_model=List[ResearchPlan], tags=["研究计划"])
async def search_research_plans(query: ResearchQuery):
    """
    根据输入的研究领域或关键词，返回可能的研究计划建议
    """
    try:
        # 使用LLM生成研究计划建议
        research_plans = await llm_service.generate_research_plans(query.query)
        return research_plans
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"生成研究计划失败: {str(e)}")

@app.get("/api/plan/{plan_id}", response_model=ResearchPlanDetail, tags=["研究计划"])
async def get_research_plan(plan_id: str):
    """
    获取指定研究计划的详细信息
    """
    try:
        # 获取研究计划详情
        plan_detail = await llm_service.get_research_plan_detail(plan_id)
        if not plan_detail:
            raise HTTPException(status_code=404, detail=f"未找到ID为{plan_id}的研究计划")
        return plan_detail
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"获取研究计划失败: {str(e)}")

@app.post("/api/chat/{plan_id}", response_model=ChatMessage, tags=["对话"])
async def chat_with_plan(plan_id: str, message: ChatMessage):
    """
    与特定研究计划相关的AI对话
    """
    try:
        # 获取AI对提问的回复
        response = await llm_service.chat_about_research_plan(plan_id, message.content)
        return ChatMessage(role="assistant", content=response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"处理对话失败: {str(e)}")

@app.get("/api/papers", tags=["论文"])
async def search_papers(
    query: str = Query(..., description="搜索关键词"),
    limit: int = Query(10, description="返回论文数量上限")
):
    """
    根据关键词搜索相关论文
    """
    try:
        papers = await paper_service.search_papers(query, limit)
        return papers
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"搜索论文失败: {str(e)}")

if __name__ == "__main__":
    # 开发环境运行
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)