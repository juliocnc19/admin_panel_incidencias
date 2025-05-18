import { endpoints } from "@/const/endpoints";
import Attachment from "@/core/models/Attachment";
import DataResponse from "@/core/response/DataResponse";
import { api } from "@/lib/api";

export const uploadIncident = async (formData: FormData): Promise<DataResponse<Attachment[]>> => {
  const { data } = await api.post(endpoints.incidents.upload, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};
