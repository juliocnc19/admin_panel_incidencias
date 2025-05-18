import { deleteUser } from "@/api/users/deleteUser";
import { useMutation } from "@tanstack/react-query";

export const useDeleteUser = () => {
  return useMutation({
    mutationFn: deleteUser,
  });
};
