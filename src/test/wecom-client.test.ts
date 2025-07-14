import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import nock from 'nock';
import { WeComClient } from '../wecom-client.js';

describe('WeComClient', () => {
  let client: WeComClient;
  const mockWebhookUrl = 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=test-key';

  beforeEach(() => {
    client = new WeComClient(mockWebhookUrl);
    nock.cleanAll();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('sendMessage', () => {
    it('should send text message successfully', async () => {
      const scope = nock('https://qyapi.weixin.qq.com')
        .post('/cgi-bin/webhook/send', {
          msgtype: 'text',
          text: {
            content: 'Hello, World!',
          },
        })
        .query({ key: 'test-key' })
        .reply(200, { errcode: 0, errmsg: 'ok' });

      const result = await client.sendMessage({
        message_type: 'text',
        content: 'Hello, World!',
      });

      assert.strictEqual(result.success, true);
      assert.strictEqual(scope.isDone(), true);
    });

    it('should send text message with mentions', async () => {
      const scope = nock('https://qyapi.weixin.qq.com')
        .post('/cgi-bin/webhook/send', {
          msgtype: 'text',
          text: {
            content: 'Hello everyone!',
            mentioned_list: ['@all'],
          },
        })
        .query({ key: 'test-key' })
        .reply(200, { errcode: 0, errmsg: 'ok' });

      const result = await client.sendMessage({
        message_type: 'text',
        content: 'Hello everyone!',
        mentioned_list: ['@all'],
      });

      assert.strictEqual(result.success, true);
      assert.strictEqual(scope.isDone(), true);
    });

    it('should send markdown message successfully', async () => {
      const markdownContent = '# Title\n**Bold text**';
      const scope = nock('https://qyapi.weixin.qq.com')
        .post('/cgi-bin/webhook/send', {
          msgtype: 'markdown',
          markdown: {
            content: markdownContent,
          },
        })
        .query({ key: 'test-key' })
        .reply(200, { errcode: 0, errmsg: 'ok' });

      const result = await client.sendMessage({
        message_type: 'markdown',
        content: markdownContent,
      });

      assert.strictEqual(result.success, true);
      assert.strictEqual(scope.isDone(), true);
    });

    it('should send image message with correct md5', async () => {
      const base64Image = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
      
      const scope = nock('https://qyapi.weixin.qq.com')
        .post('/cgi-bin/webhook/send', (body: any) => {
          return body.msgtype === 'image' && 
                 body.image.base64 === base64Image &&
                 typeof body.image.md5 === 'string' &&
                 body.image.md5.length === 32;
        })
        .query({ key: 'test-key' })
        .reply(200, { errcode: 0, errmsg: 'ok' });

      const result = await client.sendMessage({
        message_type: 'image',
        content: base64Image,
      });

      assert.strictEqual(result.success, true);
      assert.strictEqual(scope.isDone(), true);
    });

    it('should send news message successfully', async () => {
      const scope = nock('https://qyapi.weixin.qq.com')
        .post('/cgi-bin/webhook/send', {
          msgtype: 'news',
          news: {
            articles: [{
              title: 'Test Article',
              description: 'Article content',
              url: 'https://example.com',
              picurl: 'https://example.com/pic.jpg',
            }],
          },
        })
        .query({ key: 'test-key' })
        .reply(200, { errcode: 0, errmsg: 'ok' });

      const result = await client.sendMessage({
        message_type: 'news',
        content: 'Article content',
        title: 'Test Article',
        url: 'https://example.com',
        description: 'Article content',
        picurl: 'https://example.com/pic.jpg',
      });

      assert.strictEqual(result.success, true);
      assert.strictEqual(scope.isDone(), true);
    });

    it('should handle WeChat API error', async () => {
      const scope = nock('https://qyapi.weixin.qq.com')
        .post('/cgi-bin/webhook/send')
        .query({ key: 'test-key' })
        .reply(200, { errcode: 93000, errmsg: 'invalid webhook url' });

      const result = await client.sendMessage({
        message_type: 'text',
        content: 'Test message',
      });

      assert.strictEqual(result.success, false);
      assert.ok(result.message?.includes('invalid webhook url'));
      assert.strictEqual(scope.isDone(), true);
    });

    it('should handle network error', async () => {
      const scope = nock('https://qyapi.weixin.qq.com')
        .post('/cgi-bin/webhook/send')
        .query({ key: 'test-key' })
        .replyWithError('Network error');

      const result = await client.sendMessage({
        message_type: 'text',
        content: 'Test message',
      });

      assert.strictEqual(result.success, false);
      assert.ok(result.message?.includes('HTTP error'));
      assert.strictEqual(scope.isDone(), true);
    });

    it('should validate news message parameters', async () => {
      const result = await client.sendMessage({
        message_type: 'news',
        content: 'Article content',
        // Missing required title and url
      });

      assert.strictEqual(result.success, false);
      assert.ok(result.message?.includes('News message requires title and url'));
    });

    it('should handle unsupported message type', async () => {
      const result = await client.sendMessage({
        message_type: 'unsupported' as any,
        content: 'Test content',
      });

      assert.strictEqual(result.success, false);
      assert.ok(result.message?.includes('Unsupported message type'));
    });
  });
});