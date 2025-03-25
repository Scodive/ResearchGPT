from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class ResearchQuery(BaseModel):
    """研究查询模型"""
    query: str = Field(..., description="研究领域或关键词")
    
class PaperMetadata(BaseModel):
    """论文元数据模型"""
    title: str
    authors: List[str]
    year: Optional[int] = None
    venue: Optional[str] = None
    doi: Optional[str] = None
    url: Optional[str] = None
    citation_count: Optional[int] = None
    abstract: Optional[str] = None

class ResearchGap(BaseModel):
    """研究空白模型"""
    description: str
    related_papers: List[str]
    potential_impact: str
    difficulty_level: str
    
class ResearchPlan(BaseModel):
    """研究计划概要模型"""
    id: str
    title: str
    description: str
    tags: List[str]
    created_at: datetime = Field(default_factory=datetime.now)

class TimelinePhase(BaseModel):
    """研究时间表阶段"""
    phase: str
    duration: str
    activities: List[str]

class ResearchPlanDetail(BaseModel):
    """研究计划详情模型"""
    id: str
    title: str
    description: str
    background: str
    methodology: str
    expectedResults: str
    timeline: List[TimelinePhase]
    resources: List[str]
    tags: List[str]
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: Optional[datetime] = None
    related_papers: Optional[List[PaperMetadata]] = None
    identified_gaps: Optional[List[ResearchGap]] = None

class ChatRole(str, Enum):
    """聊天角色枚举"""
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"

class ChatMessage(BaseModel):
    """聊天消息模型"""
    role: str = Field(..., description="消息发送者角色")
    content: str = Field(..., description="消息内容")
    timestamp: datetime = Field(default_factory=datetime.now)

class ChatSession(BaseModel):
    """聊天会话模型"""
    id: str
    plan_id: str
    messages: List[ChatMessage]
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)