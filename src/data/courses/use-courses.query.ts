import Courses from "@repositories/courses";
import { API_ENDPOINTS, LOCAL_ENDPOINTS } from "@utils/api/endpoints";
import { useMutation, useQuery } from "@tanstack/react-query";

export type IPostVariables = {
  title: string;
  content: string;
  identifier: string;
  categoryId: number;
  TotalStudents: number;
  totalLesson: number;
  imageUrl?: string;
  status: string;
  featured: string;
  createdBy?: string;
  deleted?: number;
  createdAt?: string;
  updatedAt?: string;
  instructorId: number;
  price: number;
  duration: string;
  language: string;
  certificate: string;
  rating: number;
};

const fetchCoursesData = async (options: any, localContext?: any) => {
  const endpoint = localContext
    ? LOCAL_ENDPOINTS.COURSES
    : API_ENDPOINTS.COURSES;
  const { data } = await Courses.find(
    `${endpoint}?filter=${JSON.stringify(options)}`,
    localContext
  );
  return data;
};

const useCoursesQuery = (options: any, localContext?: any) => {
  return useQuery({
    queryKey: ["Courses"],
    queryFn: () => fetchCoursesData(options, localContext),
    enabled: true,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};

const useCreateCoursesMutation = () => {
  return useMutation({
    mutationFn: (variables: IPostVariables) => {
      return Courses.create(API_ENDPOINTS.COURSES, variables);
    },
  });
};

const useUpdateCoursesMutation = () => {
  return useMutation({
    mutationFn: (params: any) => {
      return Courses.patchUpdate(
        `${API_ENDPOINTS.COURSES}/${params.id}`,
        params
      );
    },
  });
};
const useUpdateCoursesById = () => {
  return useMutation({
    mutationFn: (params: any) => {
      const variables = {
        id: params.id,
        postStatus: params.postStatus,
        updatedAt: new Date().toISOString(),
      };

      return Courses.patchUpdate(
        `${API_ENDPOINTS.COURSES}/${params.id}`,
        variables
      );
    },
  });
};

const fetchCoursesDetails = async (identifier: any, localContext?: any) => {
  const endpoint = localContext
    ? LOCAL_ENDPOINTS.COURSES
    : API_ENDPOINTS.COURSES;
  const { data } = await Courses.find(
    `${endpoint}/details/${identifier}`,
    localContext
  );
  return data;
};

const useDetailsCoursesInfo = (identifier: string, localContext?: any) => {
  return useQuery({
    queryKey: ["Courses", identifier],
    queryFn: () => fetchCoursesDetails(identifier, localContext),
    enabled: !!identifier,
  });
};

const useDeleteCours = (localContext?: any) => {
  const endpoint = localContext
    ? LOCAL_ENDPOINTS.COURSES
    : API_ENDPOINTS.COURSES;

  return useMutation({
    mutationFn: (id: number) => {
      return Courses.delete(`${endpoint}/${id}`);
    },
  });
};

const fetchCategoryCours = async (identifier: any, localContext?: any) => {
  const endpoint = localContext
    ? LOCAL_ENDPOINTS.COURSES
    : API_ENDPOINTS.COURSES;
  const { data } = await Courses.find(
    `${endpoint}/category/${identifier}`,
    localContext
  );
  return data;
};

const fetchTagCourses = async (identifier: any, localContext?: any) => {
  const endpoint = localContext
    ? LOCAL_ENDPOINTS.COURSES
    : API_ENDPOINTS.COURSES;
  const { data } = await Courses.find(
    `${endpoint}/tag/${identifier}`,
    localContext
  );
  return data;
};

const fetchCategoryCourses = async (identifier: any, localContext?: any) => {
  const endpoint = localContext
    ? LOCAL_ENDPOINTS.COURSES
    : API_ENDPOINTS.COURSES;
  const { data } = await Courses.find(
    `${endpoint}/category/${identifier}`,
    localContext
  );
  return data;
};

const fetchRelatedCourses = async (
  categoryId: string,
  currentPostId: string,
  ctx: any
) => {
  //Courses.find(`${endpoint}?filter=${JSON.stringify(options)}`, localContext);
  const endpoint = ctx ? LOCAL_ENDPOINTS.COURSES : API_ENDPOINTS.COURSES;
  const response = await Courses.find(
    `${endpoint}?filter=${encodeURIComponent(
      JSON.stringify({
        where: {
          categoryId,
          id: { neq: currentPostId },
          deleted: false,
          postStatus: "published",
        },
        order: ["createdAt DESC"],
        limit: 6,

        include: [
          {
            relation: "category",
            scope: {
              fields: { id: true, identifier: true, categoryName: true },
            },
          },
          {
            relation: "tags",
            scope: {
              fields: { id: true, identifier: true, postId: true, name: true },
            },
          },
        ],
      })
    )}`,
    ctx
  );

  return response.data;
};

export {
  fetchCoursesData,
  useCoursesQuery,
  useCreateCoursesMutation,
  useUpdateCoursesMutation,
  useUpdateCoursesById,
  useDetailsCoursesInfo,
  useDeleteCours,
  fetchCoursesDetails,
  fetchCategoryCourses,
  fetchRelatedCourses,
};
