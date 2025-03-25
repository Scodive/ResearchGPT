const jsonMatch = generatedText.match(/\{[\s\S]*\}/); 

// 使用Gemini API生成详细研究计划
async function generateDetailedPlan(planId: string) {
  // ... 其他代码保持不变 ...
  
  try {
    const response = await fetch(API_URL, {
      // ... 请求配置保持不变 ...
    });
    
    if (!response.ok) {
      throw new Error(`API响应错误: ${response.status}`);
    }
    
    const data = await response.json();
    const generatedText = data.candidates[0].content.parts[0].text;
    
    // 修改正则表达式，使用兼容性更好的方式
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('无法解析API返回的JSON');
    }
  } catch (error) {
    console.error('生成详细计划失败:', error);
    // ... 错误处理保持不变 ...
  }
} 