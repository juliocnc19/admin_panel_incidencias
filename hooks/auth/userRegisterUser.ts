import { registerUser } from "@/api/auth/registerUser";
import { useMutation } from "@tanstack/react-query";

export const useRegisterUser = () => {
  return useMutation({
    mutationFn: registerUser,
  })
}
