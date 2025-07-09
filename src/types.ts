export type MessageType = 'text' | 'markdown' | 'image' | 'news';

export interface TextMessage {
  msgtype: 'text';
  text: {
    content: string;
    mentioned_list?: string[];
    mentioned_mobile_list?: string[];
  };
}

export interface MarkdownMessage {
  msgtype: 'markdown';
  markdown: {
    content: string;
  };
}

export interface ImageMessage {
  msgtype: 'image';
  image: {
    base64: string;
    md5: string;
  };
}

export interface NewsMessage {
  msgtype: 'news';
  news: {
    articles: Array<{
      title: string;
      description?: string;
      url: string;
      picurl?: string;
    }>;
  };
}

export type WeComMessage = TextMessage | MarkdownMessage | ImageMessage | NewsMessage;

export interface SendMessageRequest {
  message_type: MessageType;
  content: string;
  mentioned_list?: string[];
  title?: string;
  description?: string;
  url?: string;
  picurl?: string;
}