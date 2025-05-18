import { endpoints } from "@/const/endpoints";
import { api } from "@/lib/api";
import DataResponse from "@/core/response/DataResponse";
import Incident from "@/core/models/Incident";

export const getIncidentsByUser = async (user_id: number): Promise<DataResponse<Incident[]>> => {
  const { data } = await api.get(endpoints.incidents.getByUser(user_id))
  return data
}
