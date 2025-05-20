import { deleteIncident } from "@/api/incidents/deleteIncident";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteIncident = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteIncident,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    },
  });
};
