# 手动测试指南

## 准备工作

1. 获取企业微信群机器人 Webhook URL
2. 设置环境变量
3. 构建项目
4. 配置 MCP 客户端

## 环境设置

```bash
# 设置企业微信 Webhook URL
export WECOM_WEBHOOK_URL="https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=YOUR_KEY"

# 安装依赖
npm install

# 构建项目
npm run build
```

## 测试用例

### 1. 基本文本消息

**测试工具调用：**
```json
{
  "name": "send_wecom_message",
  "arguments": {
    "message_type": "text",
    "content": "Hello, World! 这是一条测试消息"
  }
}
```

**期望结果：** 群里收到纯文本消息

### 2. Markdown 消息

**测试工具调用：**
```json
{
  "name": "send_wecom_message",
  "arguments": {
    "message_type": "markdown",
    "content": "# 测试标题\n\n**粗体文本**\n\n*斜体文本*\n\n- 列表项1\n- 列表项2\n\n[链接](https://www.example.com)"
  }
}
```

**期望结果：** 群里收到格式化的 Markdown 消息

### 3. @提醒消息

**测试工具调用：**
```json
{
  "name": "send_wecom_message",
  "arguments": {
    "message_type": "text",
    "content": "大家好！这是一条@所有人的消息",
    "mentioned_list": ["@all"]
  }
}
```

**期望结果：** 群里收到@所有人的消息

### 4. 图片消息

**测试工具调用：**
```json
{
  "name": "send_wecom_message",
  "arguments": {
    "message_type": "image",
    "content": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
  }
}
```

**期望结果：** 群里收到图片消息

### 5. 图文消息

**测试工具调用：**
```json
{
  "name": "send_wecom_message",
  "arguments": {
    "message_type": "news",
    "content": "这是一篇测试文章的内容",
    "title": "测试文章标题",
    "description": "这是文章的描述信息",
    "url": "https://www.example.com",
    "picurl": "https://www.example.com/image.jpg"
  }
}
```

**期望结果：** 群里收到图文消息卡片

## 错误测试

### 1. 缺少必需参数

**测试工具调用：**
```json
{
  "name": "send_wecom_message",
  "arguments": {
    "message_type": "text"
  }
}
```

**期望结果：** 返回参数错误

### 2. 无效的消息类型

**测试工具调用：**
```json
{
  "name": "send_wecom_message",
  "arguments": {
    "message_type": "invalid_type",
    "content": "测试内容"
  }
}
```

**期望结果：** 返回不支持的消息类型错误

### 3. 图文消息缺少必需参数

**测试工具调用：**
```json
{
  "name": "send_wecom_message",
  "arguments": {
    "message_type": "news",
    "content": "测试内容"
  }
}
```

**期望结果：** 返回缺少 title 和 url 参数错误

## MCP 客户端测试

### Claude Desktop

1. 配置 `claude_desktop_config.json`
2. 重启 Claude Desktop
3. 测试工具调用是否正常

### Cline (VS Code)

1. 在 VS Code 中配置 MCP 服务器
2. 测试工具调用是否正常

### Continue

1. 配置 Continue 插件
2. 测试工具调用是否正常

## 性能测试

### 1. 并发消息测试

连续发送多条消息，测试服务器稳定性

### 2. 长文本消息测试

发送包含大量文本的消息，测试消息长度限制

### 3. 特殊字符测试

发送包含特殊字符、emoji 的消息，测试编码处理

## 验证清单

- [ ] 服务器正常启动
- [ ] 工具列表正确返回
- [ ] 文本消息发送成功
- [ ] Markdown 消息格式正确
- [ ] @提醒功能正常
- [ ] 图片消息发送成功
- [ ] 图文消息发送成功
- [ ] 错误处理正确
- [ ] 多个 MCP 客户端兼容
- [ ] 环境变量配置正确
- [ ] 性能表现良好

## 故障排除

### 常见问题

1. **Webhook URL 无效**
   - 检查 URL 格式是否正确
   - 确认群机器人配置是否正确

2. **环境变量未设置**
   - 确认 `WECOM_WEBHOOK_URL` 已设置
   - 检查环境变量值是否正确

3. **MCP 客户端连接失败**
   - 检查服务器是否正常启动
   - 确认客户端配置是否正确

4. **消息发送失败**
   - 检查网络连接
   - 查看错误日志
   - 验证消息格式是否正确

### 调试技巧

1. 使用 `npm run dev` 启动开发模式
2. 查看控制台输出的错误信息
3. 使用 nock 模拟 API 调用进行调试
4. 检查企业微信后台的机器人状态