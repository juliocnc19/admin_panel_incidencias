import { updateAttachment } from "@/api/attachments/updateAttachment";
import { useMutation } from "@tanstack/react-query";

export const useUpdateAttachment = () => {
  return useMutation({
    mutationFn: ({ id, ...attachment }: any) => updateAttachment(id, attachment),
  });
};
