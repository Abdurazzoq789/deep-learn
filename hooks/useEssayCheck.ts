import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

export interface EssayCheckResponse {
  response: string;
}

export const useEssayCheck = () => {
  return useMutation<EssayCheckResponse, Error, { text: string }>({
    mutationFn: async ({ text }: { text: string }) => {
      const res = await axios.post<EssayCheckResponse>('https://api.deep-learn.uz/api/essay-checking', { text });
      return res.data;
    },
  });
};
