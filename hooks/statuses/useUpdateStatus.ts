import { updateStatus } from "@/api/statuses/updateStatus";
import { useMutation } from "@tanstack/react-query";

export const useUpdateStatus = () => {
  return useMutation({
    mutationFn: ({ id, ...status }: any) => updateStatus(id, status),
  });
};
