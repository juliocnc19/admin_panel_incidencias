import { getRoles } from "@/api/roles/getRoles";
import { useQuery } from "@tanstack/react-query";

export const useGetRoles = () => {
  return useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
};
