import { createStatus } from "@/api/statuses/createStatus";
import { useMutation } from "@tanstack/react-query";

export const useCreateStatus = () => {
  return useMutation({
    mutationFn: createStatus,
  });
};
