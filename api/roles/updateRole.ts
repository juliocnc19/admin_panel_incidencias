import { endpoints } from "@/const/endpoints";
import Role from "@/core/models/Role";
import DataResponse from "@/core/response/DataResponse";
import { api } from "@/lib/api";

export const updateRole = async (id: string | number, role: any): Promise<DataResponse<Role>> => {
  const { data } = await api.put(endpoints.roles.update(id), role);
  return data;
};
