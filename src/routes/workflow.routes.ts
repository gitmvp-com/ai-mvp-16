import { Router, Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { IWorkflow, ICreateWorkflowRequest } from '../types/workflow.types.js';
import { WorkflowExecutor } from '../engine/WorkflowExecutor.js';

export function createWorkflowRouter(executor: WorkflowExecutor) {
  const router = Router();
  const workflows = new Map<string, IWorkflow>();

  // Create a workflow
  router.post('/', (req: Request, res: Response) => {
    try {
      const body = req.body as ICreateWorkflowRequest;
      
      if (!body.name || !body.nodes || body.nodes.length === 0) {
        return res.status(400).json({ 
          error: 'Invalid workflow: name and nodes are required' 
        });
      }

      const workflow: IWorkflow = {
        id: uuid(),
        name: body.name,
        nodes: body.nodes,
        active: body.active ?? false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      workflows.set(workflow.id, workflow);
      
      res.status(201).json(workflow);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get all workflows
  router.get('/', (req: Request, res: Response) => {
    const allWorkflows = Array.from(workflows.values());
    res.json(allWorkflows);
  });

  // Get workflow by ID
  router.get('/:id', (req: Request, res: Response) => {
    const workflow = workflows.get(req.params.id);
    
    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }
    
    res.json(workflow);
  });

  // Execute workflow
  router.post('/:id/execute', async (req: Request, res: Response) => {
    try {
      const workflow = workflows.get(req.params.id);
      
      if (!workflow) {
        return res.status(404).json({ error: 'Workflow not found' });
      }

      const execution = await executor.executeWorkflow(workflow);
      res.json(execution);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get workflow executions
  router.get('/:id/executions', (req: Request, res: Response) => {
    const workflow = workflows.get(req.params.id);
    
    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }

    const executions = executor.getWorkflowExecutions(workflow.id);
    res.json(executions);
  });

  // Delete workflow
  router.delete('/:id', (req: Request, res: Response) => {
    const deleted = workflows.delete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Workflow not found' });
    }
    
    res.status(204).send();
  });

  return router;
}
