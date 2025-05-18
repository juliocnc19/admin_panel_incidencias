import { api } from "@/lib/api";
import { endpoints } from "@/const/endpoints";
import DataResponse from "@/core/response/DataResponse";
import Attachment from "@/core/models/Attachment";

export const getAttachments = async (): Promise<DataResponse<Attachment[]>> => {
  const { data } = await api.get(endpoints.attachments.getAll);
  return data;
};
