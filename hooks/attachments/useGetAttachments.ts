import { getAttachments } from "@/api/attachments/getAttachments";
import { useQuery } from "@tanstack/react-query";

export const useGetAttachments = () => {
  return useQuery({
    queryKey: ["attachments"],
    queryFn: getAttachments,
  });
};
