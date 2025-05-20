import { getUsers } from "@/api/users/getUsers";
import { useQuery } from "@tanstack/react-query";

export const useGetUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
};
