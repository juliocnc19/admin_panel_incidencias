import { deleteAttachment } from "@/api/attachments/deleteAttachment";
import { useMutation } from "@tanstack/react-query";

export const useDeleteAttachment = () => {
  return useMutation({
    mutationFn: deleteAttachment,
  });
};
