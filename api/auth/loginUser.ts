import { endpoints } from "@/const/endpoints";
import { api } from "@/lib/api";
import User from "@/core/models/User";
import DataResponse from "@/core/response/DataResponse";

export const loginUser = async (body:any):Promise<DataResponse<User>> => {
  const {data} = await api.post(endpoints.auth.login,body)
  return data
}
