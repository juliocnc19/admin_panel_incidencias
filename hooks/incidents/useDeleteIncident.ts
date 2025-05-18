import { deleteIncident } from "@/api/incidents/deleteIncident";
import { useMutation } from "@tanstack/react-query";

export const useDeleteIncident = () => {
  return useMutation({
    mutationFn: deleteIncident,
  });
};
