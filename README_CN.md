# WeComBot MCP 服务器

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![MCP](https://img.shields.io/badge/MCP-1.0-orange.svg)](https://modelcontextprotocol.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

一个用于企业微信群机器人集成的 Model Context Protocol (MCP) 服务器。通过任何兼容 MCP 的客户端直接向企业微信群发送消息。

[中文文档](README_CN.md) | [English](README.md)

## 特性

- 🚀 **多种消息类型**: 支持文本、Markdown、图片和图文消息
- 🔄 **MCP 1.0 兼容**: 适用于 Claude Desktop、Continue、Cline 等 MCP 客户端
- 📝 **富文本支持**: 完整的 Markdown 格式支持
- 👥 **提醒功能**: 支持 @所有人 和特定用户提醒
- 🖼️ **图片消息**: Base64 图片支持，自动生成 MD5
- 📰 **图文卡片**: 丰富的链接预览卡片
- ✅ **类型安全**: 完整的 TypeScript 实现
- 🛠️ **简单配置**: 简单的环境变量设置

## 快速开始

### 前置条件

- Node.js 18+ 
- 企业微信群机器人 webhook URL
- 兼容 MCP 的客户端（Claude Desktop、Continue、Cline 等）

### 安装

```bash
# 克隆仓库
git clone https://github.com/yourusername/wecombot-mcp.git
cd wecombot-mcp

# 安装依赖
npm install

# 构建项目
npm run build
```

### 配置

1. **获取企业微信 Webhook URL**
   - 在企业微信群中创建群机器人
   - 复制 webhook URL（格式：`https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=YOUR_KEY`）

2. **配置 MCP 客户端**

#### Claude Desktop
在 `claude_desktop_config.json` 中添加：
```json
{
  "mcpServers": {
    "wecombot": {
      "command": "node",
      "args": ["/path/to/wecombot-mcp/dist/index.js"],
      "env": {
        "WECOM_WEBHOOK_URL": "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=YOUR_KEY"
      }
    }
  }
}
```

#### Continue/Cline (VS Code)
在 MCP 配置中添加：
```json
{
  "mcpServers": [
    {
      "name": "wecombot",
      "command": "node",
      "args": ["/path/to/wecombot-mcp/dist/index.js"],
      "env": {
        "WECOM_WEBHOOK_URL": "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=YOUR_KEY"
      }
    }
  ]
}
```

3. **重启你的 MCP 客户端** 以加载新服务器

## 使用方法

### 文本消息
```json
{
  "name": "send_wecom_message",
  "arguments": {
    "message_type": "text",
    "content": "你好，世界！🌍"
  }
}
```

### Markdown 消息
```json
{
  "name": "send_wecom_message",
  "arguments": {
    "message_type": "markdown",
    "content": "# 项目更新\n\n**状态**: ✅ 完成\n\n- 功能 A 已实现\n- 测试通过\n- 准备部署\n\n> 团队辛苦了！"
  }
}
```

### @提醒消息
```json
{
  "name": "send_wecom_message",
  "arguments": {
    "message_type": "text",
    "content": "会议将在 10 分钟后开始！",
    "mentioned_list": ["@all"]
  }
}
```

### 图文消息
```json
{
  "name": "send_wecom_message",
  "arguments": {
    "message_type": "news",
    "content": "了解 AI 和 MCP 集成的最新发展。",
    "title": "🤖 Model Context Protocol 指南",
    "description": "构建 MCP 服务器的完整指南",
    "url": "https://modelcontextprotocol.io/",
    "picurl": "https://example.com/thumbnail.jpg"
  }
}
```

### 图片消息
```json
{
  "name": "send_wecom_message",
  "arguments": {
    "message_type": "image",
    "content": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
  }
}
```

## API 参考

### 工具: `send_wecom_message`

通过 webhook 向企业微信群发送消息。

#### 参数

| 参数 | 类型 | 必需 | 描述 |
|------|------|------|------|
| `message_type` | string | 是 | 消息类型：`text`、`markdown`、`image` 或 `news` |
| `content` | string | 是 | 消息内容或 base64 图片数据 |
| `mentioned_list` | string[] | 否 | 要提醒的用户列表（使用 `@all` 提醒所有人） |
| `title` | string | 否 | 图文消息标题（图文类型必需） |
| `description` | string | 否 | 图文消息描述 |
| `url` | string | 否 | 图文消息链接（图文类型必需） |
| `picurl` | string | 否 | 图文消息图片链接 |

#### 响应

```json
{
  "content": [
    {
      "type": "text",
      "text": "消息已成功发送到企业微信群。类型：text"
    }
  ]
}
```

## 开发

### 运行测试

```bash
# 运行所有测试
npm test

# 以开发模式运行测试
npm run test:dev

# 使用真实 webhook 测试（需要 WECOM_WEBHOOK_URL）
node test-real-webhook.js

# 测试 MCP 服务器功能
node test-mcp-server.js
```

### 开发模式

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

### 项目结构

```
wecombot-mcp/
├── src/
│   ├── index.ts          # MCP 服务器入口
│   ├── wecom-client.ts   # 企业微信 API 客户端
│   ├── types.ts          # TypeScript 类型定义
│   └── test/             # 测试文件
├── dist/                 # 编译后的 JavaScript
├── test-*.js            # 集成测试脚本
└── README.md            # 本文件
```

## 贡献

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

### 开发指南

- 所有新代码使用 TypeScript
- 遵循现有代码风格
- 为新功能添加测试
- 及时更新文档
- 确保所有测试通过后再提交

## 测试

项目包含全面的测试：

- **单元测试**: 核心功能测试
- **集成测试**: 真实 webhook 测试
- **MCP 协议测试**: 协议兼容性测试
- **兼容性测试**: 多客户端兼容性测试

详细测试结果请查看 [TEST_REPORT.md](TEST_REPORT.md)。

## 故障排除

### 常见问题

1. **服务器启动失败**
   - 检查 Node.js 18+ 是否已安装
   - 验证 webhook URL 设置是否正确
   - 确保项目已构建 (`npm run build`)

2. **消息发送失败**
   - 验证 webhook URL 是否有效
   - 检查机器人是否有发送消息的权限
   - 确保群机器人配置正确

3. **MCP 客户端无法连接**
   - 验证客户端配置中的服务器路径
   - 检查环境变量是否设置
   - 配置更改后重启 MCP 客户端

### 调试模式

```bash
# 启用调试日志
DEBUG=wecombot* npm start

# 详细测试输出
npm run test:dev -- --verbose
```

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 致谢

- [Model Context Protocol](https://modelcontextprotocol.io/) 提供 MCP 规范
- [企业微信 API](https://developer.work.weixin.qq.com/) 提供 webhook 集成
- [Anthropic](https://www.anthropic.com/) 提供 MCP SDK 和工具

## 支持

- 🐛 **Bug 报告**: [GitHub Issues](https://github.com/yourusername/wecombot-mcp/issues)
- 💡 **功能请求**: [GitHub Discussions](https://github.com/yourusername/wecombot-mcp/discussions)
- 📖 **文档**: [Wiki](https://github.com/yourusername/wecombot-mcp/wiki)

---

用 ❤️ 为 MCP 社区制作