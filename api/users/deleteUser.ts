import { endpoints } from "@/const/endpoints";
import User from "@/core/models/User";
import DataResponse from "@/core/response/DataResponse";
import DeleteResponse from "@/core/response/DeleteResponse";
import { api } from "@/lib/api";

export const deleteUser = async (id: number | string): Promise<DataResponse<DeleteResponse<null>>> => {
  const {data} = await api.delete(endpoints.users.delete(id));
  return data
};
