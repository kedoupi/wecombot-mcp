import axios from 'axios';
import crypto from 'crypto';
import { WeComMessage, SendMessageRequest, MessageType } from './types.js';

export class WeComClient {
  private webhookUrl: string;

  constructor(webhookUrl: string) {
    this.webhookUrl = webhookUrl;
  }

  private createTextMessage(content: string, mentionedList?: string[]): WeComMessage {
    return {
      msgtype: 'text',
      text: {
        content,
        mentioned_list: mentionedList,
      },
    };
  }

  private createMarkdownMessage(content: string): WeComMessage {
    return {
      msgtype: 'markdown',
      markdown: {
        content,
      },
    };
  }

  private createImageMessage(base64Data: string): WeComMessage {
    const md5 = crypto.createHash('md5').update(base64Data, 'base64').digest('hex');
    return {
      msgtype: 'image',
      image: {
        base64: base64Data,
        md5,
      },
    };
  }

  private createNewsMessage(
    title: string,
    content: string,
    url: string,
    description?: string,
    picurl?: string
  ): WeComMessage {
    return {
      msgtype: 'news',
      news: {
        articles: [
          {
            title,
            description: description || content.substring(0, 100),
            url,
            picurl,
          },
        ],
      },
    };
  }

  async sendMessage(request: SendMessageRequest): Promise<{ success: boolean; message?: string }> {
    try {
      let message: WeComMessage;

      switch (request.message_type) {
        case 'text':
          message = this.createTextMessage(request.content, request.mentioned_list);
          break;
        case 'markdown':
          message = this.createMarkdownMessage(request.content);
          break;
        case 'image':
          message = this.createImageMessage(request.content);
          break;
        case 'news':
          if (!request.title || !request.url) {
            throw new Error('News message requires title and url');
          }
          message = this.createNewsMessage(
            request.title,
            request.content,
            request.url,
            request.description,
            request.picurl
          );
          break;
        default:
          throw new Error(`Unsupported message type: ${request.message_type}`);
      }

      const response = await axios.post(this.webhookUrl, message, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });

      if (response.data.errcode === 0) {
        return { success: true };
      } else {
        return {
          success: false,
          message: `WeChat API error: ${response.data.errmsg} (code: ${response.data.errcode})`,
        };
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          message: `HTTP error: ${error.message}`,
        };
      }
      return {
        success: false,
        message: `Unexpected error: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }
}