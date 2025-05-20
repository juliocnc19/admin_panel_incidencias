import { getIncidents } from "@/api/incidents/getIncidents";
import { useQuery } from "@tanstack/react-query";

export const useGetIncidents = () => {
  return useQuery({
    queryKey: ["incidents"],
    queryFn: getIncidents,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
};
