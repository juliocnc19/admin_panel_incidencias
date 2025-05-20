import { createAttachment } from "@/api/attachments/createAttachment";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateAttachment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createAttachment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attachments'] });
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    },
  });
};
