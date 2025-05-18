import { api } from "@/lib/api";
import { endpoints } from "@/const/endpoints";
import DataResponse from "@/core/response/DataResponse";
import DeleteResponse from "@/core/response/DeleteResponse";

export const deleteAttachment = async (id: string | number): Promise<DataResponse<DeleteResponse<null>>> => {
  const { data } = await api.delete(endpoints.attachments.delete(id));
  return data;
};
