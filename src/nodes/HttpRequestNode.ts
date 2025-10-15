import axios, { AxiosRequestConfig, Method } from 'axios';
import { INode, INodeType, IExecutionResult, INodeExecutionData } from '../types/workflow.types.js';

export class HttpRequestNode implements INodeType {
  async execute(node: INode, inputData?: INodeExecutionData[]): Promise<IExecutionResult> {
    try {
      const { url, method = 'GET', headers = {}, body } = node.parameters;

      if (!url) {
        throw new Error('URL parameter is required');
      }

      const config: AxiosRequestConfig = {
        url,
        method: method as Method,
        headers,
      };

      if (body && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
        config.data = body;
      }

      const response = await axios(config);

      const result: INodeExecutionData = {
        json: {
          statusCode: response.status,
          headers: response.headers,
          body: response.data,
        },
      };

      return {
        success: true,
        data: [result],
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'HTTP request failed',
      };
    }
  }
}
