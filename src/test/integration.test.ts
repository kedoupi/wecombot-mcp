import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import { WeComClient } from '../wecom-client.js';

// 真实的集成测试 - 使用真实的 WeChat Work webhook
describe('WeComClient Integration Tests', () => {
  const realWebhookUrl = 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=1be816b9-96b4-406f-a88a-f5b167847ce6';
  let client: WeComClient;

  beforeEach(() => {
    client = new WeComClient(realWebhookUrl);
  });

  it('should send text message successfully to real WeChat group', async () => {
    const result = await client.sendMessage({
      message_type: 'text',
      content: '🧪 测试消息：文本消息发送成功！',
    });

    assert.strictEqual(result.success, true);
    console.log('✅ 文本消息发送成功');
  });

  it('should send text message with mentions to real WeChat group', async () => {
    const result = await client.sendMessage({
      message_type: 'text',
      content: '🧪 测试消息：带 @all 的文本消息',
      mentioned_list: ['@all'],
    });

    assert.strictEqual(result.success, true);
    console.log('✅ 带提醒的文本消息发送成功');
  });

  it('should send markdown message successfully to real WeChat group', async () => {
    const markdownContent = `# 🧪 Markdown 测试消息
    
**粗体文本** 和 *斜体文本*

## 功能列表
- [x] 文本消息 ✅
- [x] Markdown 消息 ✅
- [ ] 图片消息 🔄
- [ ] 新闻消息 🔄

> 这是一个引用块

\`\`\`javascript
console.log('Hello WeChat Work!');
\`\`\`

[访问项目地址](https://github.com/kedoupi/wecombot-mcp)`;

    const result = await client.sendMessage({
      message_type: 'markdown',
      content: markdownContent,
    });

    assert.strictEqual(result.success, true);
    console.log('✅ Markdown 消息发送成功');
  });

  it('should send image message successfully to real WeChat group', async () => {
    // 使用一个小的测试图片 (1x1 透明 PNG)
    const base64Image = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
    
    const result = await client.sendMessage({
      message_type: 'image',
      content: base64Image,
    });

    assert.strictEqual(result.success, true);
    console.log('✅ 图片消息发送成功');
  });

  it('should send news message successfully to real WeChat group', async () => {
    const result = await client.sendMessage({
      message_type: 'news',
      content: '这是一个新闻消息的内容描述',
      title: '🧪 测试新闻：WeComBot MCP Server 发布',
      url: 'https://github.com/kedoupi/wecombot-mcp',
      description: 'WeComBot MCP Server 是一个企业微信群机器人的 MCP 服务器，支持多种消息类型发送。',
      picurl: 'https://avatars.githubusercontent.com/u/100000?v=4',
    });

    assert.strictEqual(result.success, true);
    console.log('✅ 新闻消息发送成功');
  });

  it('should handle invalid webhook URL gracefully', async () => {
    const invalidClient = new WeComClient('https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=invalid-key');
    
    const result = await invalidClient.sendMessage({
      message_type: 'text',
      content: '这条消息应该发送失败',
    });

    assert.strictEqual(result.success, false);
    assert.ok(result.message?.includes('invalid webhook url') || result.message?.includes('HTTP error'));
    console.log('✅ 无效 webhook 错误处理正常');
  });

  it('should validate required parameters for news message', async () => {
    const result = await client.sendMessage({
      message_type: 'news',
      content: '缺少必要参数的新闻消息',
      // 缺少 title 和 url
    });

    assert.strictEqual(result.success, false);
    assert.ok(result.message?.includes('News message requires title and url'));
    console.log('✅ 参数验证正常');
  });

  it('should handle unsupported message type', async () => {
    const result = await client.sendMessage({
      message_type: 'unsupported' as any,
      content: '不支持的消息类型',
    });

    assert.strictEqual(result.success, false);
    assert.ok(result.message?.includes('Unsupported message type'));
    console.log('✅ 不支持的消息类型处理正常');
  });
});