# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-09

### Added
- Initial release of WeComBot MCP Server
- Support for WeChat Work (企业微信) group bot integration
- Multiple message types support:
  - Text messages
  - Markdown messages with full formatting
  - Image messages with base64 encoding
  - News/link card messages
- @mention functionality (@all and specific users)
- MCP 1.0 protocol compliance
- TypeScript implementation with full type safety
- Comprehensive test suite:
  - Unit tests for core functionality
  - Integration tests with real webhook
  - MCP protocol compatibility tests
- Multi-client compatibility:
  - Claude Desktop
  - Continue (VS Code)
  - Cline
  - Other MCP-compatible clients
- Environment variable configuration
- Automatic MD5 generation for images
- Standard MCP error handling
- Stdio transport support

### Documentation
- Complete README with usage examples
- Chinese documentation (README_CN.md)
- API reference documentation
- Troubleshooting guide
- Contributing guidelines
- MIT license

### Testing
- 100% real webhook functionality testing
- 100% MCP protocol compliance testing
- Comprehensive test report generation
- Manual testing guide
- Automated test scripts

### Development
- TypeScript 5.0+ support
- Node.js 18+ compatibility
- ESM module support
- Development and production build scripts
- Code quality and style enforcement