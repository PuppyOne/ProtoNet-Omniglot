import type { RPCErrorObject } from '@/types/rpc-error-object';


export const isRPCError = (obj: unknown): obj is RPCErrorObject => {
  return typeof obj === 'object' && obj !== null && 'error' in obj;
};
