import { createIncident } from "@/api/incidents/createIncident";
import { useMutation } from "@tanstack/react-query";

export const useCreateIncident = () => {
  return useMutation({
    mutationFn: createIncident,
  });
};
