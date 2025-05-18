import { endpoints } from "@/const/endpoints";
import User from "@/core/models/User";
import DataResponse from "@/core/response/DataResponse";
import { api } from "@/lib/api";


export const getUsers = async (): Promise<DataResponse<User[]>> => {
  const { data } = await api.get(endpoints.users.getAll);
  return data;
};
