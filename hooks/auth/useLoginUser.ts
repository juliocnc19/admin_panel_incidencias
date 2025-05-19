"use client"
import { loginUser } from "@/api/auth/loginUser";
import { useMutation } from "@tanstack/react-query";

export const useLoginUser = () => {
  return useMutation({
    mutationFn: loginUser,
  })
}
