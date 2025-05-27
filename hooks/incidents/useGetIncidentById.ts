import { getIncidentById } from "@/api/incidents/getIncidentById";
import { useQuery } from "@tanstack/react-query";

export const useGetIncidentById = (id: string | number) => {
  return useQuery({
    queryKey: ["incidents", id],
    queryFn: () => getIncidentById(id),
    enabled: !!id,
  });
}; 