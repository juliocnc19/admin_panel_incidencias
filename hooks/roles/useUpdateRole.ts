import { updateRole } from "@/api/roles/updateRole";
import { useMutation } from "@tanstack/react-query";

export const useUpdateRole = () => {
  return useMutation({
    mutationFn: ({ id, ...role }: any) => updateRole(id, role),
  });
};
