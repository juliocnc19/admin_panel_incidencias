import { updateAttachment } from "@/api/attachments/updateAttachment";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateAttachment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, ...attachment }: any) => updateAttachment(id, attachment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attachments'] });
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    },
  });
};
