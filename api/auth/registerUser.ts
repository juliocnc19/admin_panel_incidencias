import { endpoints } from "@/const/endpoints";
import { api } from "@/lib/api";
import DataResponse from "@/core/response/DataResponse";
import User from "@/core/models/User";

export const registerUser = async (input: any): Promise<DataResponse<User>> => {
  const { data } = await api.post(endpoints.auth.register, input)
  return data
}
