import request from '@/utils/request';
import { useToast } from 'ui';
import { useMutation } from '@tanstack/react-query';
import { Resume } from 'shared';

const printResume = (data: Resume): Promise<{ url: string }> =>
  request.post('/resume/print', data, {
    timeout: 1000 * 60,
  });

export const usePrintResume = () => {
  const { toast } = useToast();
  const { isPending: loading, mutateAsync: printResumeFn } = useMutation({
    mutationFn: printResume,
    onSuccess() {
      toast({
        title: 'Print resume success!',
      });
    },
  });
  return {
    loading,
    printResume: printResumeFn,
  };
};
