import Lesson from "@repositories/lesson";
import { API_ENDPOINTS, LOCAL_ENDPOINTS } from "@utils/api/endpoints";
import { useMutation, useQuery } from "@tanstack/react-query";
import { create } from "domain";

export type ILessonVariables = { 
  name: string;
  identifier: string;
  details: number;
  createdBy: string; 
  createdAt: Date; 
  status: number;
};

const fetchLessonsData = async (options: any, localContext?: any) => {
  const endpoint = localContext
    ? LOCAL_ENDPOINTS.LESSONS
    : API_ENDPOINTS.LESSONS;
  const { data } = await Lesson.find(
    `${endpoint}?filter=${JSON.stringify(options)}`,
    localContext
  );
  return data;
};

const useLessonsQuery = (options: any, localContext?: any) => {
  return useQuery({
    queryKey: ["Lessons"],
    queryFn: () => fetchLessonsData(options, localContext),
    enabled: true,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};

const useCreateLessonMutation = () => {
  return useMutation({
    mutationFn: (variables: ILessonVariables) => {
      return Lesson.create(API_ENDPOINTS.LESSONS, variables);
    },
  });
};

const useUpdateLessonMutation = () => {
  return useMutation({
    mutationFn: (params: any) => {
      return Lesson.patchUpdate(
        `${API_ENDPOINTS.LESSONS}/${params.id}`,
        params
      );
    },
  });
};
const useUpdateLessonById = () => {
  return useMutation({
    mutationFn: (params: any) => {
      const variables = {
        id: params.id,
        status: params.status,
        createAt: new Date().toISOString(),
      };

      return Lesson.patchUpdate(
        `${API_ENDPOINTS.LESSONS}/${params.id}`,
        variables
      );
    },
  });
};

 
 

const useDeleteLesson = (localContext?: any) => {
  const endpoint = localContext
    ? LOCAL_ENDPOINTS.LESSONS
    : API_ENDPOINTS.LESSONS;

  return useMutation({
    mutationFn: (id: number) => {
      return Lesson.delete(`${endpoint}/${id}`);
    },
  });
};

const fetchCategoryCours = async (identifier: any, localContext?: any) => {
  const endpoint = localContext
    ? LOCAL_ENDPOINTS.LESSONS
    : API_ENDPOINTS.LESSONS;
  const { data } = await Lesson.find(
    `${endpoint}/category/${identifier}`,
    localContext
  );
  return data;
};

const fetchTagCourses = async (identifier: any, localContext?: any) => {
  const endpoint = localContext
    ? LOCAL_ENDPOINTS.LESSONS
    : API_ENDPOINTS.LESSONS;
  const { data } = await Lesson.find(
    `${endpoint}/tag/${identifier}`,
    localContext
  );
  return data;
};

const fetchCategoryCourses = async (identifier: any, localContext?: any) => {
  const endpoint = localContext
    ? LOCAL_ENDPOINTS.LESSONS
    : API_ENDPOINTS.LESSONS;
  const { data } = await Lesson.find(
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
  //Lesson.find(`${endpoint}?filter=${JSON.stringify(options)}`, localContext);
  const endpoint = ctx ? LOCAL_ENDPOINTS.LESSONS : API_ENDPOINTS.LESSONS;
  const response = await Lesson.find(
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
  fetchLessonsData,
  useLessonsQuery,
  useCreateLessonMutation,
  useUpdateLessonMutation,
  useUpdateLessonById, 
  useDeleteLesson,  
};
