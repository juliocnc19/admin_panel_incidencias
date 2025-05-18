import { api } from "@/lib/api";
import { endpoints } from "@/const/endpoints";
import DataResponse from "@/core/response/DataResponse";
import Attachment from "@/core/models/Attachment";

export const createAttachment = async (attachment: any): Promise<DataResponse<Attachment[]>> => {
  const { data } = await api.post(endpoints.attachments.create, attachment);
  return data;
};
