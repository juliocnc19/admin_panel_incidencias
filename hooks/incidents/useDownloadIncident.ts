import { downloadIncident } from "@/api/incidents/downloadIncident";
import { useMutation } from "@tanstack/react-query";

export const useDownloadIncident = () => {
  return useMutation({
    mutationFn: downloadIncident,
  });
};
