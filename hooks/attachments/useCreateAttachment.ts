import { createAttachment } from "@/api/attachments/createAttachment";
import { useMutation } from "@tanstack/react-query";

export const useCreateAttachment = () => {
  return useMutation({
    mutationFn: createAttachment,
  });
};
