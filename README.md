# ResearchGPT

ResearchGPT是一个智能研究助手，可以帮助研究人员分析文献、发现研究空白、设计实验和撰写论文。

## 主要功能

- **文献分析**：自动分析领域内的最新文献，理解已有研究内容
- **研究空白发现**：找到未解决的问题或现有方法的局限性
- **实验设计**：生成可行的实验设计和详细研究计划
- **论文撰写**：辅助生成高质量的学术论文

## 技术架构

- 前端：Next.js
- 后端：FastAPI
- AI核心：集成开源LLM模型
- 数据存储：知识图谱(Neo4j)

## 系统设计

![系统架构图](frontend/public/system_architecture.png)

### 前端组件

- 用户界面：使用Next.js和Tailwind CSS构建响应式界面
- 搜索组件：允许用户输入研究领域或关键词
- 研究计划展示：显示生成的研究计划和详细信息
- 对话界面：与AI助手交互，讨论研究计划

### 后端服务

- API服务：提供RESTful API接口
- LLM服务：集成大语言模型，生成研究计划
- 论文服务：搜索和分析学术论文
- 知识图谱：构建领域知识图谱（计划功能）

## 如何使用

1. 输入关键词或研究领域
2. 系统自动给出几个研究设计方案
3. 选择一个设计方案后进一步实现
4. 与系统交互，提出问题或修改意见

## 安装与运行

### 前端

```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 运行开发服务器
npm run dev
```

### 后端

```bash
# 进入后端目录
cd backend

# 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# 安装依赖
pip install -r requirements.txt

# 设置环境变量
cp .env.example .env
# 编辑.env文件，填写必要的配置

# 运行服务器
python main.py
```

## 开发路线图

1. **MVP阶段**：基本的研究计划生成和对话功能
2. **Alpha阶段**：集成论文搜索和分析功能
3. **Beta阶段**：添加知识图谱和更高级的研究空白发现
4. **1.0版本**：完整的研究流程支持，从文献分析到论文撰写

## 贡献指南

欢迎贡献代码、报告问题或提出新功能建议。请查看[贡献指南](CONTRIBUTING.md)了解更多信息。

## 许可证

本项目采用MIT许可证，详见[LICENSE](LICENSE)文件。