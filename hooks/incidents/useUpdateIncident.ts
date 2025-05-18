import { updateIncident } from "@/api/incidents/updateIncident";
import { useMutation } from "@tanstack/react-query";

export const useUpdateIncident = () => {
  return useMutation({
    mutationFn: ({ id, ...incident }: any) => updateIncident(id, incident),
  });
};
