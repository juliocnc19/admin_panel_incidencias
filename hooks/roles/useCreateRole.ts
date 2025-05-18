import { createRole } from "@/api/roles/createRole";
import { useMutation } from "@tanstack/react-query";

export const useCreateRole = () => {
  return useMutation({
    mutationFn: createRole,
  });
};
