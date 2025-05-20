import { createIncident } from "@/api/incidents/createIncident";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateIncident = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createIncident,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    },
  });
};
