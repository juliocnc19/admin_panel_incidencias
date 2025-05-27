import { endpoints } from "@/const/endpoints";
import Incident from "@/core/models/Incident";
import DataResponse from "@/core/response/DataResponse";
import { api } from "@/lib/api";

export const getIncidentById = async (id: string | number): Promise<DataResponse<Incident>> => {
  const { data } = await api.get(endpoints.incidents.getById(id));
  return data;
}; 