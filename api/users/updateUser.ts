import { endpoints } from "@/const/endpoints";
import { api } from "@/lib/api";
import User from "@/core/models/User";
import DataResponse from "@/core/response/DataResponse";

export const updateUser = async (id: User['id'], user: Partial<User>): Promise<DataResponse<User>> => {
  const { data } = await api.put(endpoints.users.update(id), user);
  return data;
};
