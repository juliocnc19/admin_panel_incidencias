import { deleteStatus } from "@/api/statuses/deleteStatus";
import { useMutation } from "@tanstack/react-query";

export const useDeleteStatus = () => {
  return useMutation({
    mutationFn: deleteStatus,
  });
};
