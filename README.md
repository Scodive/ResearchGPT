# [ResearchGPT网站](https://research-gpt-three.vercel.app)

ResearchGPT是一个智能研究助手，可以帮助研究人员分析文献、发现研究空白、设计实验和撰写论文。

<img width="229" alt="image" src="https://github.com/user-attachments/assets/99478f35-f0d9-4c71-8e52-d673b0d09dde" /><img width="229" alt="image" src="https://github.com/user-attachments/assets/07e350d6-3245-4a91-866e-006ffdc4f44f" /> <img width="361" alt="image" src="https://github.com/user-attachments/assets/a8efae7f-f32e-419b-baa3-62985fd6c30b" />

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=Scodive/ResearchGPT&type=Date)](https://www.star-history.com/#Scodive/ResearchGPT&Date)

## 主要功能

* **研究探索**：
  - 输入研究领域，生成多个创新性研究方向
  - 支持一键生成详细研究计划
  - 实时保存和编辑研究计划
  - 智能标签系统，快速识别研究关键点

* **研究计划生成**：
  - 自动生成完整研究方案，包含背景、目标、方法等
  - 可编辑和更新研究计划内容
  - 智能时间线规划
  - 本地存储功能，保证数据不丢失

* **论文生成**：
  - 支持中英文论文生成
  - IEEE格式LaTeX代码生成
  - 实时预览和编辑功能
  - 一键下载LaTeX源文件

## 技术架构

* **前端**：
  - Next.js 13 (App Router)
  - React 18
  - Tailwind CSS
  - TypeScript

* **API集成**：
  - Google Gemini API
  - 支持本地模型部署（计划中）

* **数据存储**：
  - 本地存储 (localStorage)
  - 计划支持数据库存储

## 系统特性

* **响应式设计**：
  - 适配桌面和移动设备
  - 现代化UI界面
  - 流畅的用户交互体验

* **智能生成**：
  - 基于Gemini大语言模型
  - 支持上下文理解
  - 自动格式化输出

* **数据安全**：
  - 本地优先的数据存储策略
  - 隐私保护措施
  - 免责声明和使用条款

## 如何使用

1. **研究探索**：
   - 在首页输入研究领域或关键词
   - 点击"探索"按钮生成研究方向
   - 选择感兴趣的研究方向查看详细计划

2. **查看和编辑研究计划**：
   - 点击研究方向卡片进入详情页
   - 使用"编辑计划"按钮修改研究主题
   - 系统自动保存修改内容

3. **生成论文**：
   - 进入"AI论文生成"页面
   - 输入研究主题
   - 选择语言（中文/英文）
   - 点击生成按钮
   - 下载或复制LaTeX代码

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

### 环境变量配置

创建 `.env.local` 文件：

```env
GEMINI_API_KEY=your_api_key_here
```

## 开发路线图

1. **当前版本**：
   - [x] 基础研究计划生成
   - [x] 论文LaTeX生成
   - [x] 本地数据存储
   - [x] 响应式UI设计

2. **计划中功能**：
   - [ ] 用户账户系统
   - [ ] 云端数据同步
   - [ ] 协作功能
   - [ ] PDF预览
   - [ ] 参考文献管理
   - [ ] 多语言支持扩展

## 隐私和免责声明

- 本项目仅供研究和学习使用
- 生成内容仅供参考，需要用户自行验证
- 不对生成内容的准确性和完整性负责
- 请遵守学术诚信原则

## 联系方式

- Email: hjiangbg@connect.ust.hk
- GitHub: [https://github.com/Scodive/ResearchGPT](https://github.com/Scodive/ResearchGPT)

## 许可证

本项目采用MIT许可证，详见LICENSE文件。
