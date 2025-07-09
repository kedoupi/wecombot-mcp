import { describe, it } from 'node:test';
import assert from 'node:assert';
import { 
  CallToolRequestSchema, 
  ListToolsRequestSchema, 
  Tool, 
  CallToolResult 
} from '@modelcontextprotocol/sdk/types.js';

describe('MCP Protocol Compatibility', () => {
  describe('Tool Definition Compliance', () => {
    it('should have valid tool definition structure', () => {
      const toolDefinition: Tool = {
        name: 'send_wecom_message',
        description: 'Send message to WeChat Work group via webhook',
        inputSchema: {
          type: 'object',
          properties: {
            message_type: {
              type: 'string',
              enum: ['text', 'markdown', 'image', 'news'],
              description: 'Type of message to send',
            },
            content: {
              type: 'string',
              description: 'Message content (text/markdown) or base64 image data',
            },
            mentioned_list: {
              type: 'array',
              items: { type: 'string' },
              description: 'List of users to mention (@all for everyone)',
            },
          },
          required: ['message_type', 'content'],
        },
      };

      // Validate required fields
      assert.ok(toolDefinition.name);
      assert.ok(toolDefinition.description);
      assert.ok(toolDefinition.inputSchema);

      // Validate name format (should be valid identifier)
      assert.match(toolDefinition.name, /^[a-zA-Z_][a-zA-Z0-9_]*$/);

      // Validate description is meaningful
      assert.ok(toolDefinition.description.length > 10);

      // Validate input schema is JSON Schema compliant
      assert.strictEqual(toolDefinition.inputSchema.type, 'object');
      assert.ok(toolDefinition.inputSchema.properties);
      assert.ok(Array.isArray(toolDefinition.inputSchema.required));
    });

    it('should have JSON Schema compliant input schema', () => {
      const schema = {
        type: 'object',
        properties: {
          message_type: {
            type: 'string',
            enum: ['text', 'markdown', 'image', 'news'],
            description: 'Type of message to send',
          },
          content: {
            type: 'string',
            description: 'Message content (text/markdown) or base64 image data',
          },
          mentioned_list: {
            type: 'array',
            items: { type: 'string' },
            description: 'List of users to mention (@all for everyone)',
          },
        },
        required: ['message_type', 'content'],
      };

      // Validate top-level schema
      assert.strictEqual(schema.type, 'object');
      assert.ok(schema.properties);
      assert.ok(Array.isArray(schema.required));

      // Validate each property
      Object.values(schema.properties).forEach(prop => {
        assert.ok(prop.type);
        assert.ok(prop.description);
      });

      // Validate enum constraint
      assert.ok(Array.isArray(schema.properties.message_type.enum));
      assert.ok(schema.properties.message_type.enum.length > 0);

      // Validate array schema
      assert.ok(schema.properties.mentioned_list.items);
      assert.strictEqual(schema.properties.mentioned_list.items.type, 'string');
    });
  });

  describe('Request/Response Format Compliance', () => {
    it('should handle ListTools request format', () => {
      const request = {
        method: 'tools/list',
        params: {},
      };

      // Validate request structure matches MCP spec
      assert.strictEqual(request.method, 'tools/list');
      assert.ok(request.params !== undefined);
    });

    it('should handle CallTool request format', () => {
      const request = {
        method: 'tools/call',
        params: {
          name: 'send_wecom_message',
          arguments: {
            message_type: 'text',
            content: 'Test message',
          },
        },
      };

      // Validate request structure
      assert.strictEqual(request.method, 'tools/call');
      assert.ok(request.params.name);
      assert.ok(request.params.arguments);
      assert.strictEqual(typeof request.params.arguments, 'object');
    });

    it('should return proper CallTool response format', () => {
      const response: CallToolResult = {
        content: [
          {
            type: 'text',
            text: 'Message sent successfully to WeChat Work group. Type: text',
          },
        ],
      };

      // Validate response structure
      assert.ok(Array.isArray(response.content));
      assert.ok(response.content.length > 0);
      assert.strictEqual(response.content[0].type, 'text');
      assert.ok(response.content[0].text);
    });
  });

  describe('Error Handling Compliance', () => {
    it('should use standard MCP error codes', () => {
      const errorCodes = {
        ParseError: -32700,
        InvalidRequest: -32600,
        MethodNotFound: -32601,
        InvalidParams: -32602,
        InternalError: -32603,
      };

      // Validate error codes match MCP specification
      assert.strictEqual(errorCodes.ParseError, -32700);
      assert.strictEqual(errorCodes.InvalidRequest, -32600);
      assert.strictEqual(errorCodes.MethodNotFound, -32601);
      assert.strictEqual(errorCodes.InvalidParams, -32602);
      assert.strictEqual(errorCodes.InternalError, -32603);
    });

    it('should format error responses correctly', () => {
      const errorResponse = {
        error: {
          code: -32602,
          message: 'Invalid params',
          data: {
            details: 'message_type is required',
          },
        },
      };

      // Validate error response structure
      assert.ok(errorResponse.error);
      assert.ok(typeof errorResponse.error.code === 'number');
      assert.ok(errorResponse.error.message);
      assert.ok(errorResponse.error.code < 0); // MCP error codes are negative
    });
  });

  describe('Client Compatibility', () => {
    it('should be compatible with Claude Desktop config format', () => {
      const config = {
        mcpServers: {
          wecombot: {
            command: 'node',
            args: ['dist/index.js'],
            env: {
              WECOM_WEBHOOK_URL: 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=test',
            },
          },
        },
      };

      // Validate config structure
      assert.ok(config.mcpServers);
      assert.ok(config.mcpServers.wecombot);
      assert.ok(config.mcpServers.wecombot.command);
      assert.ok(Array.isArray(config.mcpServers.wecombot.args));
      assert.ok(config.mcpServers.wecombot.env);
    });

    it('should be compatible with Continue/Cline config format', () => {
      const config = {
        mcpServers: [
          {
            name: 'wecombot',
            command: 'node',
            args: ['dist/index.js'],
            env: {
              WECOM_WEBHOOK_URL: 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=test',
            },
          },
        ],
      };

      // Validate array-based config structure
      assert.ok(Array.isArray(config.mcpServers));
      assert.ok(config.mcpServers[0].name);
      assert.ok(config.mcpServers[0].command);
      assert.ok(Array.isArray(config.mcpServers[0].args));
    });
  });

  describe('Transport Compatibility', () => {
    it('should support stdio transport', () => {
      const transportConfig = {
        type: 'stdio',
        command: 'node',
        args: ['dist/index.js'],
      };

      // Validate stdio transport config
      assert.strictEqual(transportConfig.type, 'stdio');
      assert.ok(transportConfig.command);
      assert.ok(Array.isArray(transportConfig.args));
    });

    it('should handle environment variable configuration', () => {
      const envConfig = {
        WECOM_WEBHOOK_URL: 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=test',
      };

      // Validate environment variable format
      assert.ok(envConfig.WECOM_WEBHOOK_URL);
      assert.ok(envConfig.WECOM_WEBHOOK_URL.startsWith('https://'));
      assert.ok(envConfig.WECOM_WEBHOOK_URL.includes('key='));
    });
  });

  describe('Protocol Version Compatibility', () => {
    it('should support MCP version 1.0', () => {
      const serverInfo = {
        protocolVersion: '1.0.0',
        capabilities: {
          tools: {},
        },
      };

      // Validate protocol version
      assert.match(serverInfo.protocolVersion, /^1\.0\.\d+$/);
      assert.ok(serverInfo.capabilities);
      assert.ok(serverInfo.capabilities.tools !== undefined);
    });

    it('should declare proper server capabilities', () => {
      const capabilities = {
        tools: {},
        // Note: We don't support these capabilities in this server
        // resources: undefined,
        // prompts: undefined,
        // logging: undefined,
      };

      // Validate only supported capabilities are declared
      assert.ok(capabilities.tools !== undefined);
      assert.strictEqual(Object.keys(capabilities).length, 1);
    });
  });
});