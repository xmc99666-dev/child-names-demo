# 儿童识字小报生成器

基于 Nano Banana Pro API 的儿童识字小报图像生成工具，适合 5-9 岁儿童识字学习。

## 功能特点

- 4 种预设场景模板（超市、医院、公园、学校）
- 支持自定义主题、标题和词汇
- 一键生成 A4 竖版识字小报
- 生成的图片包含拼音标注
- 支持 PNG 格式下载

## 使用方法

### 1. 获取 API Key

访问 [https://kie.ai/api-key](https://kie.ai/api-key) 获取你的 API Key。

### 2. 打开应用

直接在浏览器中打开 `index.html` 文件即可使用。

### 3. 配置 API Key

在页面顶部的 "API Key 配置" 区域：
- 输入你的 API Key
- 点击 "保存密钥" 按钮
- API Key 会保存在浏览器本地存储中，下次访问时自动加载

### 4. 生成小报

1. 选择预设场景（超市/医院/公园/学校），或手动填写自定义内容
2. 点击 "生成小报" 按钮
3. 等待 30-60 秒生成完成
4. 下载生成的图片

## 项目结构

```
names-pictures-0112/
├── index.html          # 主页面
├── config.js           # 配置文件
├── css/
│   └── style.css       # 样式文件
├── js/
│   ├── api.js          # API 调用封装
│   ├── templates.js    # 预设场景模板
│   ├── prompt.js       # 提示词生成器
│   └── app.js          # 主应用逻辑
└── ai-docs/
    ├── api-nano-bana-pro.md   # API 文档
    └── prompt.md              # 提示词模板
```

## 预设场景

| 场景 | 标题 | 包含词汇 |
|------|------|----------|
| 超市 | 走进超市 | 收银员、货架、苹果、牛奶、推车等 |
| 医院 | 快乐医院 | 医生、护士、药、听诊器、病床等 |
| 公园 | 美丽公园 | 滑梯、秋千、草地、花、树等 |
| 学校 | 快乐校园 | 老师、黑板、书本、铅笔、课桌等 |

## 图片配置

- 宽高比：3:4（竖版 A4）
- 分辨率：2K
- 格式：PNG

## 技术栈

- 纯 HTML + CSS + JavaScript
- 无需后端服务器
- 使用 LocalStorage 存储 API Key

## 注意事项

- 请妥善保管你的 API Key，不要泄露给他人
- 生成的图片质量取决于 AI 模型效果
- 建议使用现代浏览器（Chrome、Edge、Firefox 等）

## API 说明

本应用使用 [Nano Banana Pro API](https://kie.ai) 进行图像生成。

API 文档位于 [ai-docs/api-nano-bana-pro.md](ai-docs/api-nano-bana-pro.md)

## 许可证

MIT License
