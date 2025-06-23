import Company from "@repositories/company";
import { API_ENDPOINTS, LOCAL_ENDPOINTS } from "@utils/api/endpoints";
import { useMutation, useQuery } from "@tanstack/react-query";

export type ICompaniesVariables = {
  name: string;
  address: string;
  imageUrl?: string;
  createdBy: string;
};

const fetchCompanyData = async (options: any, localContext?: any) => {
  const endpoint = localContext ? LOCAL_ENDPOINTS.COMPANIES : API_ENDPOINTS.COMPANIES;

  const { data } = await Company.find(`${endpoint}?filter=${JSON.stringify(options)}`, localContext);
  return data;
};

const useCompanyQuery = (options: any, localContext?: any) => {
  return useQuery({
    queryKey: ["companies"],
    queryFn: () => fetchCompanyData(options, localContext),
    enabled: true,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};

const useCreateCompanyMutation = () => {
  return useMutation({
    mutationFn: (variables: ICompaniesVariables) => {
      return Company.create(API_ENDPOINTS.COMPANIES, variables);
    },
  });
};

const useUpdateCompanyInfo = () => {
  return useMutation({
    mutationFn: (params: any) => {
      return Company.patchUpdate(`${API_ENDPOINTS.COMPANIES}/${params.id}`, params);
    },
  });
};

const fetchCompanyDetails = async (id: number, localContext?: any) => {
  const endpoint = localContext ? LOCAL_ENDPOINTS.COMPANIES : API_ENDPOINTS.COMPANIES;
  return Company.find(`${endpoint}/${id}`);
};

const useDetailsCompanyInfo = (id: number, localContext?: any) => {
  return useQuery({
    queryKey: ["Company", id],
    queryFn: () => fetchCompanyDetails(id, localContext),
    enabled: !!id,
  });
};

const useDeleteCompany = (localContext?: any) => {
  const endpoint = localContext ? LOCAL_ENDPOINTS.COMPANIES : API_ENDPOINTS.COMPANIES;

  return useMutation({
    mutationFn: (id: number) => {
      return Company.delete(`${endpoint}/${id}`);
    },
  });
};

export {
  fetchCompanyData,
  useCompanyQuery,
  useCreateCompanyMutation,
  useUpdateCompanyInfo,
  useDetailsCompanyInfo,
  useDeleteCompany,
};
