import { updateIncident } from "@/api/incidents/updateIncident";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateIncident = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, ...incident }: any) => updateIncident(id, incident),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    },
  });
};
