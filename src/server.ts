import express, { Request, Response } from 'express';
import { WorkflowExecutor } from './engine/WorkflowExecutor.js';
import { createWorkflowRouter } from './routes/workflow.routes.js';

const app = express();
const PORT = process.env.PORT || 5678;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize workflow executor
const executor = new WorkflowExecutor();

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to ai-mvp-16 - Simple Workflow Automation Tool',
    version: '0.1.0',
    endpoints: {
      createWorkflow: 'POST /api/workflows',
      listWorkflows: 'GET /api/workflows',
      getWorkflow: 'GET /api/workflows/:id',
      executeWorkflow: 'POST /api/workflows/:id/execute',
      getExecutions: 'GET /api/workflows/:id/executions',
      deleteWorkflow: 'DELETE /api/workflows/:id',
    },
  });
});

app.use('/api/workflows', createWorkflowRouter(executor));

// Error handling
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ai-mvp-16 server running on http://localhost:${PORT}`);
  console.log('📝 API Documentation: http://localhost:' + PORT);
});

export default app;
