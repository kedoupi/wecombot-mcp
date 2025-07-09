#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { WeComClient } from './wecom-client.js';
import { SendMessageRequest } from './types.js';

class WeComMCPServer {
  private server: Server;
  private wecomClient: WeComClient | null = null;

  constructor() {
    this.server = new Server(
      {
        name: 'wecombot-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
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
                title: {
                  type: 'string',
                  description: 'Title for news message (required for news type)',
                },
                description: {
                  type: 'string',
                  description: 'Description for news message',
                },
                url: {
                  type: 'string',
                  description: 'URL for news message (required for news type)',
                },
                picurl: {
                  type: 'string',
                  description: 'Picture URL for news message',
                },
              },
              required: ['message_type', 'content'],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      if (name === 'send_wecom_message') {
        return await this.handleSendMessage(args || {});
      }

      throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    });
  }

  private async handleSendMessage(args: Record<string, unknown>) {
    if (!this.wecomClient) {
      const webhookUrl = process.env.WECOM_WEBHOOK_URL;
      if (!webhookUrl) {
        throw new McpError(
          ErrorCode.InvalidRequest,
          'WECOM_WEBHOOK_URL environment variable is required'
        );
      }
      this.wecomClient = new WeComClient(webhookUrl);
    }

    try {
      const request = args as unknown as SendMessageRequest;
      const result = await this.wecomClient.sendMessage(request);

      if (result.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Message sent successfully to WeChat Work group. Type: ${request.message_type}`,
            },
          ],
        };
      } else {
        throw new McpError(ErrorCode.InternalError, result.message || 'Failed to send message');
      }
    } catch (error) {
      if (error instanceof McpError) {
        throw error;
      }
      throw new McpError(
        ErrorCode.InternalError,
        `Failed to send message: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('WeChat Work MCP server running on stdio');
  }
}

const server = new WeComMCPServer();
server.run().catch(console.error);