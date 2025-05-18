import { endpoints } from "@/const/endpoints";
import DataResponse from "@/core/response/DataResponse";
import DeleteResponse from "@/core/response/DeleteResponse";
import { api } from "@/lib/api";

export const deleteStatus = async (id: string | number): Promise<DataResponse<DeleteResponse<null>>> => {
  const { data } = await api.delete(endpoints.statuses.delete(id));
  return data;
};
