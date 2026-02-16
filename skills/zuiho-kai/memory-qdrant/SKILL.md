---
name: memory-qdrant
description: OpenClaw plugin for semantic memory with Qdrant and Transformers.js
version: 1.0.2
author: zuiho-kai
tags: [memory, semantic-search, qdrant, transformers, embeddings, local-ai]
metadata:
  openclaw:
    requires:
      bins: [node, npm]
    primaryEnv: null
---

# memory-qdrant

OpenClaw 本地语义记忆插件，基于 Qdrant 和 Transformers.js 实现零配置的语义搜索。

## 特性

- 🧠 **本地语义搜索** - 使用 Transformers.js 在本地生成 embeddings
- 💾 **内存模式** - 零配置，无需外部服务
- 🔄 **自动捕获** - 通过 lifecycle hooks 自动记录重要信息
- 🎯 **智能召回** - 根据上下文自动检索相关记忆

## 安装

```bash
clawhub install memory-qdrant
```

或手动安装：

```bash
cd ~/.openclaw/plugins
git clone https://github.com/zuiho-kai/openclaw-memory-qdrant.git memory-qdrant
cd memory-qdrant
npm install
```

## 配置

在 OpenClaw 配置文件中启用插件：

```json
{
  "plugins": {
    "memory-qdrant": {
      "enabled": true,
      "autoCapture": false,  // 默认关闭，需要时手动开启
      "autoRecall": true,
      "captureMaxChars": 500
    }
  }
}
```

### 配置选项

- **qdrantUrl** (可选): 外部 Qdrant 服务地址，留空使用内存模式
- **autoCapture** (默认 false): 自动记录对话内容，开启前请注意隐私
- **autoRecall** (默认 true): 自动注入相关记忆到对话
- **captureMaxChars** (默认 500): 单条记忆最大字符数

## 隐私与安全

### 数据存储

- **内存模式**（默认）: 数据仅在进程运行期间保存，重启后清空
- **Qdrant 模式**: 如果配置了 `qdrantUrl`，数据会发送到该服务器
  - ⚠️ 仅配置受信任的 Qdrant 服务器

### 网络访问

- **首次运行**: Transformers.js 会从 Hugging Face 下载模型文件（约 25MB）
- **运行时**: 内存模式无网络请求；Qdrant 模式会连接配置的服务器

### 自动捕获

- **autoCapture** 默认关闭，需要手动开启
- 开启后会自动记录对话内容，可能包含敏感信息
- 建议仅在个人环境使用

## 使用

插件提供三个工具：

### memory_store

保存重要信息到长期记忆：

```javascript
memory_store({
  text: "用户喜欢用 Opus 处理复杂任务",
  category: "preference",
  importance: 0.8
})
```

**参数**：
- `text` (必填): 要记忆的内容
- `category` (可选): 分类 (fact/preference/decision/entity/other)
- `importance` (可选): 重要性 0-1，默认 0.7

### memory_search

搜索相关记忆：

```javascript
memory_search({
  query: "工作流程",
  limit: 5
})
```

**参数**：
- `query` (必填): 搜索查询
- `limit` (可选): 最大结果数，默认 5

### memory_forget

删除特定记忆：

```javascript
memory_forget({
  memoryId: "uuid-here"
})
// 或通过搜索删除
memory_forget({
  query: "要删除的内容"
})
```

## 技术细节

### 架构

- **向量数据库**: Qdrant (内存模式)
- **Embedding 模型**: Xenova/all-MiniLM-L6-v2 (本地运行)
- **模块系统**: ES6 modules

### 关键实现

插件使用**工厂函数模式**导出工具，确保与 OpenClaw 的工具系统兼容：

```javascript
export default {
  name: 'memory-qdrant',
  version: '1.0.0',
  tools: [
    () => ({
      name: 'memory_search',
      description: '...',
      parameters: { ... },
      execute: async (params) => { ... }
    })
  ]
}
```

### 常见问题

**Q: 为什么要用工厂函数？**

A: OpenClaw 的工具系统会调用 `tool.execute()`，直接导出对象会导致 `tool.execute is not a function` 错误。工厂函数确保每次调用都返回新的工具实例。

**Q: 为什么要用 ES6 modules？**

A: OpenClaw 的插件加载器期望 ES6 模块格式。需要在 `package.json` 中设置 `"type": "module"`。

**Q: 数据存储在哪里？**

A: 内存模式下数据仅在进程运行期间保存。重启后需要重新索引。未来版本会支持持久化存储。

## 开发

```bash
# 安装依赖
npm install

# 测试（需要 OpenClaw 环境）
openclaw gateway restart
```

## 许可证

MIT

## 致谢

- [Qdrant](https://qdrant.tech/) - 向量数据库
- [Transformers.js](https://huggingface.co/docs/transformers.js) - 本地 ML 推理
- [OpenClaw](https://openclaw.ai/) - AI 助手框架

## 链接

- GitHub: https://github.com/zuiho-kai/openclaw-memory-qdrant
- Issues: https://github.com/zuiho-kai/openclaw-memory-qdrant/issues
