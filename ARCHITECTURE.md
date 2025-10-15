# Architecture Overview

## System Design

ai-mvp-16 is a simplified workflow automation engine with three main components:

### 1. Server Layer (`src/server.ts`)
- Express.js-based REST API
- Handles HTTP requests
- Routes to workflow management
- Port: 5678 (matching n8n convention)

### 2. Execution Engine (`src/engine/WorkflowExecutor.ts`)
- Manages workflow execution lifecycle
- Maintains execution history in memory
- Sequential node execution model
- Passes data between nodes

### 3. Node System (`src/nodes/`)
- Plugin-based node architecture
- Each node type implements `INodeType` interface
- Currently supports:
  - `HttpRequestNode`: Make HTTP requests

## Data Flow

```
Client Request → API Router → WorkflowExecutor → Node Execution → Result
```

### Workflow Execution Steps:

1. **Workflow Creation**
   - Client sends workflow definition (JSON)
   - Server validates and stores in memory
   - Returns workflow ID

2. **Workflow Execution**
   - Client triggers execution via API
   - Executor processes nodes sequentially
   - Each node receives output from previous node
   - Results stored in execution history

3. **Result Retrieval**
   - Client queries execution history
   - Returns execution status and data

## Storage

**In-Memory Only** (MVP simplification):
- Workflows stored in Map structure
- Executions stored in Map structure
- Data lost on server restart

## Node Interface

All nodes implement:

```typescript
interface INodeType {
  execute(
    node: INode,
    inputData?: INodeExecutionData[]
  ): Promise<IExecutionResult>;
}
```

## Extensibility

To add new node types:

1. Create class implementing `INodeType`
2. Add to `WorkflowExecutor.registerNodeTypes()`
3. Document in README

## Limitations (MVP)

- No database persistence
- No user authentication
- No webhook triggers
- No visual UI editor
- No node connections/branching
- Sequential execution only
- No error recovery
- No scheduling

## Future Enhancements

Potential improvements:
- Database integration (PostgreSQL/SQLite)
- User authentication & authorization
- Visual workflow editor UI
- More node types (Email, Database, etc.)
- Parallel execution support
- Webhook triggers
- Scheduled executions
- Error handling & retry logic
