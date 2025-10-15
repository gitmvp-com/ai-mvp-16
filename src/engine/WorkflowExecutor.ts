import { v4 as uuid } from 'uuid';
import { IWorkflow, IWorkflowExecution, INodeExecutionData, INodeType } from '../types/workflow.types.js';
import { HttpRequestNode } from '../nodes/HttpRequestNode.js';

export class WorkflowExecutor {
  private nodeTypes: Map<string, INodeType>;
  private executions: Map<string, IWorkflowExecution>;

  constructor() {
    this.nodeTypes = new Map();
    this.executions = new Map();
    this.registerNodeTypes();
  }

  private registerNodeTypes() {
    this.nodeTypes.set('httpRequest', new HttpRequestNode());
  }

  async executeWorkflow(workflow: IWorkflow): Promise<IWorkflowExecution> {
    const executionId = uuid();
    const execution: IWorkflowExecution = {
      id: executionId,
      workflowId: workflow.id,
      startedAt: new Date(),
      status: 'running',
    };

    this.executions.set(executionId, execution);

    try {
      let currentData: INodeExecutionData[] | undefined;

      // Execute nodes sequentially
      for (const node of workflow.nodes) {
        const nodeType = this.nodeTypes.get(node.type);
        
        if (!nodeType) {
          throw new Error(`Unknown node type: ${node.type}`);
        }

        const result = await nodeType.execute(node, currentData);
        
        if (!result.success) {
          execution.status = 'error';
          execution.error = result.error;
          execution.finishedAt = new Date();
          this.executions.set(executionId, execution);
          return execution;
        }

        currentData = result.data;
      }

      execution.status = 'success';
      execution.data = currentData;
      execution.finishedAt = new Date();
      this.executions.set(executionId, execution);
      
      return execution;
    } catch (error: any) {
      execution.status = 'error';
      execution.error = error.message || 'Workflow execution failed';
      execution.finishedAt = new Date();
      this.executions.set(executionId, execution);
      return execution;
    }
  }

  getExecution(executionId: string): IWorkflowExecution | undefined {
    return this.executions.get(executionId);
  }

  getWorkflowExecutions(workflowId: string): IWorkflowExecution[] {
    return Array.from(this.executions.values())
      .filter(exec => exec.workflowId === workflowId)
      .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime());
  }
}
