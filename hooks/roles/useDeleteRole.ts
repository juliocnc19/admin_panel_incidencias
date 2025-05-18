import { deleteRole } from "@/api/roles/deleteRole";
import { useMutation } from "@tanstack/react-query";

export const useDeleteRole = () => {
  return useMutation({
    mutationFn: deleteRole,
  });
};
