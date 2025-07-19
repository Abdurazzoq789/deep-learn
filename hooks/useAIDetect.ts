import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

export interface AIDetectResponse {
  result: {
    ai: number;
    human: number;
  };
}

export const useAIDetect = () => {
  return useMutation<AIDetectResponse, Error, { text: string }>({
    mutationFn: async ({ text }: { text: string }) => {
      const res = await axios.post<AIDetectResponse>('https://api.deep-learn.uz/api/ai-detect', { text });
      return JSON.parse((res.data as any)?.replaceAll('data: ', ''));
    },
  });
};
