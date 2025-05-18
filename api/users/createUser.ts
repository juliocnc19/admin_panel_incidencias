import { endpoints } from "@/const/endpoints";
import { api } from "@/lib/api";
import User from "@/core/models/User";
import DataResponse from "@/core/response/DataResponse";

export const createUser = async (user: Partial<User>): Promise<DataResponse<User>> => {
  const { data } = await api.post(endpoints.users.create, user);
  return data;
};
