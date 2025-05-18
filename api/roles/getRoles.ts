import { endpoints } from "@/const/endpoints";
import Role from "@/core/models/Role";
import DataResponse from "@/core/response/DataResponse";
import { api } from "@/lib/api";

export const getRoles = async (): Promise<DataResponse<Role[]>> => {
  const { data } = await api.get(endpoints.roles.getAll);
  return data;
};
