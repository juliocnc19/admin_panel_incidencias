import { uploadIncident } from "@/api/incidents/uploadIncident";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUploadIncident = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: uploadIncident,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    },
  });
};
