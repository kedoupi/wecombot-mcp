# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Model Context Protocol (MCP) server for Enterprise WeChat (企业微信) group bot integration. The server provides a standardized interface for sending messages to WeChat Work groups via webhook URLs, designed for maximum compatibility with all MCP clients.

## Architecture

- **MCP Server**: Built using `@modelcontextprotocol/sdk` with strict adherence to MCP 1.0 protocol
- **WeChat Client**: HTTP client for WeChat Work webhook API calls
- **Message Types**: Supports text, markdown, image (base64), and mention functionality
- **Configuration**: Environment variable-based configuration for webhook URLs

## Core Components

- `src/index.ts`: MCP server entry point with tool registration
- `src/wecom-client.ts`: WeChat Work API client implementation  
- `src/types.ts`: TypeScript type definitions for message schemas
- `bin/wecombot-mcp.js`: Executable wrapper script for ES module compatibility
- `src/test/`: Unit tests with nock mocking and integration tests with real webhooks

## Key Design Principles

1. **MCP Compatibility**: Ensures compatibility with Claude Desktop, Cline, Continue, and other MCP clients
2. **Standardized Tools**: Single `send_wecom_message` tool with JSON Schema validation
3. **Environment Configuration**: Uses `WECOM_WEBHOOK_URL` environment variable
4. **Error Handling**: Standard MCP error response formats

## Development Commands

```bash
# Install dependencies
npm install

# Development with hot reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Start production server
npm start

# Run all tests (unit + mocked)
npm test

# Run tests in development mode
npm run test:dev

# Run integration tests with real webhook
npm run test:integration
```

## MCP Tool Interface

The server exposes one primary tool:

**send_wecom_message**: Send messages to WeChat Work group
- `message_type`: "text" | "markdown" | "image" | "news"
- `content`: Message content or base64 image data
- `mentioned_list`: Optional array of user IDs to mention (@all for everyone)

## Configuration Setup

Set environment variable before running:
```bash
export WECOM_WEBHOOK_URL="https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=YOUR_KEY"
```

## MCP Client Configuration

### For npm global installation:
```json
{
  "mcpServers": {
    "wecombot": {
      "command": "wecombot-mcp",
      "env": {
        "WECOM_WEBHOOK_URL": "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=YOUR_KEY"
      }
    }
  }
}
```

### For local development:
```json
{
  "mcpServers": {
    "wecombot": {
      "command": "node",
      "args": ["bin/wecombot-mcp.js"],
      "env": {
        "WECOM_WEBHOOK_URL": "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=YOUR_KEY"
      }
    }
  }
}
```

### ES Module Compatibility

v1.0.2+ uses a wrapper script approach to solve ES module compatibility issues:
- `bin/wecombot-mcp.js` provides the executable entry point with proper shebang
- `dist/index.js` contains the compiled ES module without shebang
- This ensures compatibility across all MCP clients while maintaining ES module support

## Testing Framework

The project includes comprehensive testing capabilities:

### Unit Tests (`src/test/wecom-client.test.ts`)
- Uses `nock` for HTTP request mocking
- Tests all message types and error scenarios
- Validates API request formats and responses

### Integration Tests (`src/test/integration.test.ts`)
- Uses real WeChat Work webhook URLs for end-to-end testing
- Tests actual message delivery to WeChat groups
- Includes error handling and validation scenarios
- Run with `npm run test:integration` (requires `WECOM_WEBHOOK_URL` environment variable)

### Development Testing
```bash
# Run all mock tests
npm run test:dev

# Run specific test file
tsx --test src/test/wecom-client.test.ts

# Run integration tests with real webhook
WECOM_WEBHOOK_URL="your-webhook-url" npm run test:integration
```