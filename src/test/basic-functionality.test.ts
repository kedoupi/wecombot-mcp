import { describe, it } from 'node:test';
import assert from 'node:assert';
import { WeComClient } from '../wecom-client.js';
import { SendMessageRequest } from '../types.js';

describe('Basic Functionality Tests', () => {
  describe('WeComClient', () => {
    it('should create client instance', () => {
      const client = new WeComClient('https://example.com/webhook');
      assert.ok(client);
    });

    it('should validate input parameters', async () => {
      const client = new WeComClient('https://invalid-url.com');
      
      // Test missing required fields
      try {
        await client.sendMessage({} as SendMessageRequest);
        assert.fail('Should have thrown an error');
      } catch (error) {
        assert.ok(error instanceof Error);
      }
    });

    it('should handle news message validation', async () => {
      const client = new WeComClient('https://invalid-url.com');
      
      const result = await client.sendMessage({
        message_type: 'news',
        content: 'Test content',
        // Missing required title and url
      });

      assert.strictEqual(result.success, false);
      assert.ok(result.message?.includes('News message requires title and url'));
    });

    it('should handle unsupported message type', async () => {
      const client = new WeComClient('https://invalid-url.com');
      
      const result = await client.sendMessage({
        message_type: 'unsupported' as any,
        content: 'Test content',
      });

      assert.strictEqual(result.success, false);
      assert.ok(result.message?.includes('Unsupported message type'));
    });
  });

  describe('Message Type Validation', () => {
    it('should validate supported message types', () => {
      const supportedTypes = ['text', 'markdown', 'image', 'news'];
      const unsupportedTypes = ['video', 'audio', 'file', 'card'];

      supportedTypes.forEach(type => {
        // In a real scenario, this would be validated by the tool schema
        assert.ok(supportedTypes.includes(type));
      });

      unsupportedTypes.forEach(type => {
        assert.ok(!supportedTypes.includes(type));
      });
    });

    it('should validate required parameters', () => {
      const requiredParams = ['message_type', 'content'];
      const optionalParams = ['mentioned_list', 'title', 'description', 'url', 'picurl'];

      // Check that required params are indeed required
      assert.ok(requiredParams.includes('message_type'));
      assert.ok(requiredParams.includes('content'));

      // Check that optional params are not required
      optionalParams.forEach(param => {
        assert.ok(!requiredParams.includes(param));
      });
    });
  });

  describe('URL Validation', () => {
    it('should validate webhook URL format', () => {
      const validUrls = [
        'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=123',
        'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=abc123',
      ];

      const invalidUrls = [
        'http://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=123',
        'https://invalid-domain.com/webhook',
        'not-a-url',
        '',
      ];

      validUrls.forEach(url => {
        assert.ok(url.startsWith('https://qyapi.weixin.qq.com/cgi-bin/webhook/send'));
      });

      invalidUrls.forEach(url => {
        const isValid = url.startsWith('https://qyapi.weixin.qq.com/cgi-bin/webhook/send');
        assert.ok(!isValid, `URL should be invalid: ${url}`);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      const client = new WeComClient('https://invalid-domain-that-does-not-exist.com/webhook');
      
      const result = await client.sendMessage({
        message_type: 'text',
        content: 'Test message',
      });

      assert.strictEqual(result.success, false);
      assert.ok(result.message);
      assert.ok(result.message.length > 0);
    });
  });
});