# Contributing to WeComBot MCP Server

We love your input! We want to make contributing to WeComBot MCP Server as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

## Pull Requests

Pull requests are the best way to propose changes to the codebase. We actively welcome your pull requests:

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/wecombot-mcp.git
   cd wecombot-mcp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env with your WeChat Work webhook URL
   WECOM_WEBHOOK_URL=https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=YOUR_KEY
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Run tests**
   ```bash
   npm test
   ```

## Code Style

- Use TypeScript for all new code
- Follow the existing code style and patterns
- Use ESLint and Prettier for code formatting
- Write clear, readable code with meaningful variable names
- Add JSDoc comments for public APIs

## Testing

We use Node.js built-in test runner. Please ensure your changes have appropriate test coverage:

- **Unit tests**: Test individual functions and components
- **Integration tests**: Test the full MCP server functionality
- **Webhook tests**: Test real WeChat Work webhook integration

### Running Tests

```bash
# Run all tests
npm test

# Run tests in development mode
npm run test:dev

# Run specific test file
npm run test:dev src/test/wecom-client.test.ts

# Test with real webhook
node test-real-webhook.js

# Test MCP server functionality
node test-mcp-server.js
```

## Any contributions you make will be under the MIT Software License

In short, when you submit code changes, your submissions are understood to be under the same [MIT License](http://choosealicense.com/licenses/mit/) that covers the project. Feel free to contact the maintainers if that's a concern.

## Report bugs using GitHub Issues

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/yourusername/wecombot-mcp/issues/new).

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## Feature Requests

We welcome feature requests! Please:

1. Check if the feature has already been requested
2. Clearly describe the feature and its use case
3. Consider the scope and complexity
4. Be willing to contribute to the implementation

## Code Review Process

1. All submissions require review by project maintainers
2. We look for:
   - Code quality and style
   - Test coverage
   - Documentation updates
   - Backward compatibility
   - Performance implications

## Branch Naming

- `feature/description` - for new features
- `bugfix/description` - for bug fixes
- `docs/description` - for documentation updates
- `refactor/description` - for code refactoring

## Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

[optional body]

[optional footer(s)]
```

Examples:
```
feat(client): add image message support
fix(server): handle empty webhook responses
docs(readme): update installation instructions
test(webhook): add integration tests
```

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Getting Help

- Join our [Discussions](https://github.com/yourusername/wecombot-mcp/discussions)
- Check the [Wiki](https://github.com/yourusername/wecombot-mcp/wiki)
- Open an [Issue](https://github.com/yourusername/wecombot-mcp/issues)

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to WeComBot MCP Server! 🎉