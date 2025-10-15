# ai-mvp-16 - Simple Workflow Automation Tool

A minimal MVP implementation of workflow automation inspired by [n8n](https://github.com/n8n-io/n8n).

## Features

- ✨ Visual workflow builder (JSON-based)
- 🔄 HTTP Request node for making API calls
- ▶️ Execute workflows programmatically
- 🎯 Simple and lightweight architecture

## Quick Start

### Prerequisites

- Node.js >= 20.19
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/gitmvp-com/ai-mvp-16.git
cd ai-mvp-16

# Install dependencies
npm install

# Run in development mode
npm run dev

# Or build and run in production
npm run build
npm start
```

The server will start on `http://localhost:5678`

## Usage

### Create a Workflow

POST to `/api/workflows` with a workflow definition:

```json
{
  "name": "My First Workflow",
  "nodes": [
    {
      "id": "node-1",
      "type": "httpRequest",
      "parameters": {
        "url": "https://api.github.com/users/octocat",
        "method": "GET"
      }
    }
  ]
}
```

### Execute a Workflow

POST to `/api/workflows/:id/execute`

### Get Workflow Results

GET `/api/workflows/:id/executions`

## Architecture

```
src/
├── server.ts              # Express server entry point
├── types/                 # TypeScript type definitions
│   └── workflow.types.ts
├── engine/                # Workflow execution engine
│   └── WorkflowExecutor.ts
├── nodes/                 # Node implementations
│   └── HttpRequestNode.ts
└── routes/                # API routes
    └── workflow.routes.ts
```

## API Endpoints

- `POST /api/workflows` - Create a new workflow
- `GET /api/workflows/:id` - Get workflow by ID
- `GET /api/workflows` - List all workflows
- `POST /api/workflows/:id/execute` - Execute a workflow
- `GET /api/workflows/:id/executions` - Get workflow execution history

## Example Workflows

Check the `examples/` directory for sample workflow definitions.

## Differences from n8n

This is a simplified MVP focusing on core workflow execution:

- No database (in-memory storage)
- No authentication
- Single HTTP Request node only
- No visual UI (API-only)
- Simplified execution model

## License

MIT

## Credits

Inspired by [n8n](https://github.com/n8n-io/n8n) - the powerful workflow automation platform.
