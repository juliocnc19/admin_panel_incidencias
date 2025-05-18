import { getStatuses } from "@/api/statuses/getStatuses";
import { useQuery } from "@tanstack/react-query";

export const useGetStatuses = () => {
  return useQuery({
    queryKey: ["statuses"],
    queryFn: getStatuses,
  });
};
