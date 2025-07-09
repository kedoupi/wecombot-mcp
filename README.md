# WeComBot MCP Server

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![MCP](https://img.shields.io/badge/MCP-1.0-orange.svg)](https://modelcontextprotocol.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A Model Context Protocol (MCP) server for WeChat Work (企业微信) group bot integration. Send messages to WeChat Work groups directly from any MCP-compatible client.

[中文文档](README_CN.md) | [English](README.md)

## Features

- 🚀 **Multiple Message Types**: Text, Markdown, Image, and News messages
- 🔄 **MCP 1.0 Compatible**: Works with Claude Desktop, Continue, Cline, and other MCP clients
- 📝 **Rich Text Support**: Full Markdown formatting support
- 👥 **Mention Support**: @all and specific user mentions
- 🖼️ **Image Messages**: Base64 image support with automatic MD5 generation
- 📰 **News Cards**: Rich link preview cards
- ✅ **Type Safe**: Full TypeScript implementation
- 🛠️ **Easy Configuration**: Simple environment variable setup

## Quick Start

### Prerequisites

- Node.js 18+ 
- A WeChat Work group bot webhook URL
- An MCP-compatible client (Claude Desktop, Continue, Cline, etc.)

### Installation

```bash
# Install globally via npm
npm install -g @kedoupi/wecombot-mcp

# Or use directly with npx (recommended)
npx @kedoupi/wecombot-mcp
```

#### Development Installation

```bash
# Clone the repository for development
git clone https://github.com/kedoupi/wecombot-mcp.git
cd wecombot-mcp

# Install dependencies
npm install

# Build the project
npm run build
```

### Configuration

1. **Get WeChat Work Webhook URL**
   - Create a group bot in your WeChat Work group
   - Copy the webhook URL (format: `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=YOUR_KEY`)

2. **Configure MCP Client**

#### Claude Desktop
Add to your `claude_desktop_config.json`:
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
Add to your MCP configuration:
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

3. **Restart your MCP client** to load the new server

## Usage

### Text Message
```json
{
  "name": "send_wecom_message",
  "arguments": {
    "message_type": "text",
    "content": "Hello, World! 🌍"
  }
}
```

### Markdown Message
```json
{
  "name": "send_wecom_message",
  "arguments": {
    "message_type": "markdown",
    "content": "# Project Update\n\n**Status**: ✅ Complete\n\n- Feature A implemented\n- Tests passing\n- Ready for deployment\n\n> Great work team!"
  }
}
```

### Mention Message
```json
{
  "name": "send_wecom_message",
  "arguments": {
    "message_type": "text",
    "content": "Meeting starts in 10 minutes!",
    "mentioned_list": ["@all"]
  }
}
```

### News/Link Card
```json
{
  "name": "send_wecom_message",
  "arguments": {
    "message_type": "news",
    "content": "Learn about the latest developments in AI and MCP integration.",
    "title": "🤖 Model Context Protocol Guide",
    "description": "Complete guide to building MCP servers",
    "url": "https://modelcontextprotocol.io/",
    "picurl": "https://example.com/thumbnail.jpg"
  }
}
```

### Image Message
```json
{
  "name": "send_wecom_message",
  "arguments": {
    "message_type": "image",
    "content": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
  }
}
```

## API Reference

### Tool: `send_wecom_message`

Send a message to WeChat Work group via webhook.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `message_type` | string | Yes | Message type: `text`, `markdown`, `image`, or `news` |
| `content` | string | Yes | Message content or base64 image data |
| `mentioned_list` | string[] | No | List of users to mention (use `@all` for everyone) |
| `title` | string | No | Title for news message (required for news type) |
| `description` | string | No | Description for news message |
| `url` | string | No | URL for news message (required for news type) |
| `picurl` | string | No | Picture URL for news message |

#### Response

```json
{
  "content": [
    {
      "type": "text",
      "text": "Message sent successfully to WeChat Work group. Type: text"
    }
  ]
}
```

## Development

### Running Tests

```bash
# Run all tests
npm test

# Run tests in development mode
npm run test:dev

# Test with real webhook (requires WECOM_WEBHOOK_URL)
node test-real-webhook.js

# Test MCP server functionality
node test-mcp-server.js
```

### Development Mode

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Project Structure

```
wecombot-mcp/
├── src/
│   ├── index.ts          # MCP server entry point
│   ├── wecom-client.ts   # WeChat Work API client
│   ├── types.ts          # TypeScript type definitions
│   └── test/             # Test files
├── dist/                 # Compiled JavaScript
├── test-*.js            # Integration test scripts
└── README.md            # This file
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Use TypeScript for all new code
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## Testing

The project includes comprehensive tests:

- **Unit Tests**: Core functionality testing
- **Integration Tests**: Real webhook testing
- **MCP Protocol Tests**: Protocol compliance testing
- **Compatibility Tests**: Multi-client compatibility

See [TEST_REPORT.md](TEST_REPORT.md) for detailed test results.

## Troubleshooting

### Common Issues

1. **Server not starting**
   - Check that Node.js 18+ is installed
   - Verify the webhook URL is set correctly
   - Ensure the project is built (`npm run build`)

2. **Messages not sending**
   - Verify the webhook URL is valid
   - Check that the bot has permission to send messages
   - Ensure the group bot is properly configured

3. **MCP client not connecting**
   - Verify the server path in client configuration
   - Check that the environment variables are set
   - Restart the MCP client after configuration changes

### Debug Mode

```bash
# Enable debug logging
DEBUG=wecombot* npm start

# Test with verbose output
npm run test:dev -- --verbose
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Model Context Protocol](https://modelcontextprotocol.io/) for the MCP specification
- [WeChat Work API](https://developer.work.weixin.qq.com/) for the webhook integration
- [Anthropic](https://www.anthropic.com/) for MCP SDK and tools

## Support

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/yourusername/wecombot-mcp/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/yourusername/wecombot-mcp/discussions)
- 📖 **Documentation**: [Wiki](https://github.com/yourusername/wecombot-mcp/wiki)

---

Made with ❤️ for the MCP community