import { api } from "@/lib/api";
import { endpoints } from "@/const/endpoints";
import Attachment from "@/core/models/Attachment";
import DataResponse from "@/core/response/DataResponse";

export const getAttachmentById = async (id: string | number): Promise<DataResponse<Attachment>> => {
  const { data } = await api.get(endpoints.attachments.getById(id));
  return data;
};
