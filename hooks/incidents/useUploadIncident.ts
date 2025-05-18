import { uploadIncident } from "@/api/incidents/uploadIncident";
import { useMutation } from "@tanstack/react-query";

export const useUploadIncident = () => {
  return useMutation({
    mutationFn: uploadIncident,
  });
};
