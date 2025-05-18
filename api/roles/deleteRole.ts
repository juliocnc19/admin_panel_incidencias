import { endpoints } from "@/const/endpoints";
import DataResponse from "@/core/response/DataResponse";
import DeleteResponse from "@/core/response/DeleteResponse";
import { api } from "@/lib/api";

export const deleteRole = async (id: string | number): Promise<DataResponse<DeleteResponse<null>>> => {
  const { data } = await api.delete(endpoints.roles.delete(id));
  return data;
};
