import { getAttachmentsByIncident } from "@/api/attachments/getAttachmentsByIncident";
import { useQuery } from "@tanstack/react-query";

export const useGetAttachmentsByIncident = (incidentId: string | number) => {
  return useQuery({
    queryKey: ["attachments", "incident", incidentId],
    queryFn: () => getAttachmentsByIncident(incidentId),
    enabled: !!incidentId,
  });
};
