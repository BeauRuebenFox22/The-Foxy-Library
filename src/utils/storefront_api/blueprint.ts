export interface ConfigBlueprint {
  domain: string;
  token: string;
  endpoint: string;
  apiVersion?: string;
  connect(): void;
  isConnected(): boolean;
  debug(): void;
};