export interface INode {
  id: string;
  type: string;
  parameters: Record<string, any>;
  position?: [number, number];
}

export interface IWorkflow {
  id: string;
  name: string;
  nodes: INode[];
  active?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface INodeExecutionData {
  json: Record<string, any>;
  binary?: Record<string, any>;
}

export interface IExecutionResult {
  success: boolean;
  data?: INodeExecutionData[];
  error?: string;
}

export interface IWorkflowExecution {
  id: string;
  workflowId: string;
  startedAt: Date;
  finishedAt?: Date;
  status: 'running' | 'success' | 'error';
  data?: INodeExecutionData[];
  error?: string;
}

export interface INodeType {
  execute(node: INode, inputData?: INodeExecutionData[]): Promise<IExecutionResult>;
}

export interface ICreateWorkflowRequest {
  name: string;
  nodes: INode[];
  active?: boolean;
}
