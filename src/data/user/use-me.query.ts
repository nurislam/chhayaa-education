import User from "@repositories/user";
import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";

export const fetchMe = async (ctx?: any) => {
  const { data } = await User.find(API_ENDPOINTS.ME, ctx);
  return data;
};

export const useMeQuery = (ctx?: any) => {  
  return useQuery({
    queryKey: ["dataFetch"],
    queryFn:()=> fetchMe(ctx), 
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
