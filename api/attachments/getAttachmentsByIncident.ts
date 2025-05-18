import { api } from "@/lib/api";
import { endpoints } from "@/const/endpoints";
import DataResponse from "@/core/response/DataResponse";
import Attachment from "@/core/models/Attachment";

export const getAttachmentsByIncident = async (incidentId: string | number): Promise<DataResponse<Attachment>> => {
  const { data } = await api.get(endpoints.attachments.getByIncident(incidentId));
  return data;
};
