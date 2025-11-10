export interface ResponseConsignacion<T = any> {
  statusCode: number;     
  success: boolean;       
  messages: string;      
  data: T;                 
}
