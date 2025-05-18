import { updateUser } from "@/api/users/updateUser";
import { useMutation } from "@tanstack/react-query";

export const useUpdateUser = () => {
  return useMutation({
    mutationFn: ({ id, ...user }: any) => updateUser(id, user),
  });
};
