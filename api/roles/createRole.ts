import { endpoints } from "@/const/endpoints";
import Role from "@/core/models/Role";
import DataResponse from "@/core/response/DataResponse";
import { api } from "@/lib/api";

export const createRole = async (role: any): Promise<DataResponse<Role>> => {
  const { data } = await api.post(endpoints.roles.create, role);
  return data;
};
