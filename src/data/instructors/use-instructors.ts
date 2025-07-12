import Courses from "@repositories/courses";
import { API_ENDPOINTS, LOCAL_ENDPOINTS } from "@utils/api/endpoints";
import { useMutation, useQuery } from "@tanstack/react-query";
import Instructors from "@/repositories/instructors";

export type IinistructorVariables = {
  id?: number;
  identifier: string;
  name: string;
  designation?: string;
  content?: string;
  rating?: number;
  totalCourse?: number; 
  imageUrl?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  deleted?: boolean;
};

const fetchInstructorsData = async (options: any, localContext?: any) => {
  const endpoint = localContext
    ? LOCAL_ENDPOINTS.INSTRUCTORS
    : API_ENDPOINTS.INSTRUCTORS;
  const { data } = await Instructors.find(
    `${endpoint}?filter=${JSON.stringify(options)}`,
    localContext
  );
  return data;
};

const useInstructorsQuery = (options: any, localContext?: any) => {
  return useQuery({
    queryKey: ["Instructors"],
    queryFn: () => fetchInstructorsData(options, localContext),
    enabled: true,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};

const useCreateInstructorsMutation = () => {
  return useMutation({
    mutationFn: (variables: IinistructorVariables) => {
      return Instructors.create(API_ENDPOINTS.INSTRUCTORS, variables);
    },
  });
};

const useUpdateInstructorsMutation = () => {
  return useMutation({
    mutationFn: (params: any) => {
      return Instructors.patchUpdate(
        `${API_ENDPOINTS.INSTRUCTORS}/${params.id}`,
        params
      );
    },
  });
};
const useUpdateInstructorsById = () => {
  return useMutation({
    mutationFn: (params: any) => {
      return Instructors.patchUpdate(
        `${API_ENDPOINTS.INSTRUCTORS}/${params.id}`,
        params
      );
    },
  });
};

const fetchInstructorsDetails = async (identifier: any, localContext?: any) => {
  const endpoint = localContext
    ? LOCAL_ENDPOINTS.INSTRUCTORS
    : API_ENDPOINTS.INSTRUCTORS;
  const { data } = await Instructors.find(
    `${endpoint}/details/${identifier}`,
    localContext
  );
  return data;
};

const useDetailsInstructorsInfo = (identifier: string, localContext?: any) => {
  return useQuery({
    queryKey: ["Instructors", identifier],
    queryFn: () => fetchInstructorsDetails(identifier, localContext),
    enabled: !!identifier,
  });
};

const useDeleteInstructors = (localContext?: any) => {
  const endpoint = localContext
    ? LOCAL_ENDPOINTS.INSTRUCTORS
    : API_ENDPOINTS.INSTRUCTORS;

  return useMutation({
    mutationFn: (id: number) => {
      return Courses.delete(`${endpoint}/${id}`);
    },
  });
};

export {
  fetchInstructorsData,
  useInstructorsQuery,
  useCreateInstructorsMutation,
  useUpdateInstructorsMutation,
  useUpdateInstructorsById,
  useDetailsInstructorsInfo,
  useDeleteInstructors,
  fetchInstructorsDetails,
};
