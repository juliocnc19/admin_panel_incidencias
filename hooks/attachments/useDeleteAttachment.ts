import { deleteAttachment } from "@/api/attachments/deleteAttachment";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteAttachment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteAttachment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attachments'] });
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    },
  });
};
