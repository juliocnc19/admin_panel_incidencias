import { api } from "@/lib/api";
import { endpoints } from "@/const/endpoints";

export const getAttachmentsByIncident = async (incidentId: string | number): Promise<any> => {
  const { data } = await api.get(endpoints.attachments.getByIncident(incidentId));
  return data;
};
