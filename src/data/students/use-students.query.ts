import Student from "@repositories/student";
import { API_ENDPOINTS, LOCAL_ENDPOINTS } from "@utils/api/endpoints";
import { useMutation, useQuery } from "@tanstack/react-query";

export type IstudentVariables = {
  title: string;
  identifier: string;
  content?: string;
  featured?: string;
  imageUrl?: string;
  TotalStudente?: number;
  createdBy?: string;
  updatedAt?: Date,
  createdAt?: Date;
  deleted?: boolean;
  status?: string;
};

const fetchStudentsData = async (options: any, localContext?: any) => {
  const endpoint = localContext
    ? LOCAL_ENDPOINTS.STUDENTS
    : API_ENDPOINTS.STUDENTS;
  const { data } = await Student.find(
    `${endpoint}?filter=${JSON.stringify(options)}`,
    localContext
  );
  return data;
};

const useStudentsQuery = (options: any, localContext?: any) => {
  return useQuery({
    queryKey: ["Student"],
    queryFn: () => fetchStudentsData(options, localContext),
    enabled: true,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};

const useCreateStudentMutation = () => {
  return useMutation({
    mutationFn: (variables: IstudentVariables) => {
      return Student.create(API_ENDPOINTS.STUDENTS, variables);
    },
  });
};

const useUpdateStudentsMutation = () => {
  return useMutation({
    mutationFn: (params: any) => {
      return Student.patchUpdate(
        `${API_ENDPOINTS.STUDENTS}/${params.id}`,
        params
      );
    },
  });
};


const useUpdateStudentsById = () => {
  return useMutation({
    mutationFn: (params: {
      id: number;
      status?: string;
      [key: string]: any;
    }) => {
      const variables: Partial<IstudentVariables> = {
        status: params.status ?? params.postStatus, // adapt to your actual param
        updatedAt: new Date(),
      };

      return Student.patchUpdate(
        `${API_ENDPOINTS.STUDENTS}/${params.id}`,
        variables
      );
    },
  });
};


const fetchStudentsDetails = async (identifier: any, localContext?: any) => {
  const endpoint = localContext
    ? LOCAL_ENDPOINTS.STUDENTS
    : API_ENDPOINTS.STUDENTS;
  const { data } = await Student.find(
    `${endpoint}/details/${identifier}`,
    localContext
  );
  return data;
};

const useDetailsStudentsInfo = (identifier: string, localContext?: any) => {
  return useQuery({
    queryKey: ["Student", identifier],
    queryFn: () => fetchStudentsDetails(identifier, localContext),
    enabled: !!identifier,
  });
};

const useDeleteStudent = (localContext?: any) => {
  const endpoint = localContext
    ? LOCAL_ENDPOINTS.STUDENTS
    : API_ENDPOINTS.STUDENTS;

  return useMutation({
    mutationFn: (id: number) => {
      return Student.delete(`${endpoint}/${id}`);
    },
  });
};

const fetchCategoryStudent = async (identifier: any, localContext?: any) => {
  const endpoint = localContext
    ? LOCAL_ENDPOINTS.STUDENTS
    : API_ENDPOINTS.STUDENTS;
  const { data } = await Student.find(
    `${endpoint}/category/${identifier}`,
    localContext
  );
  return data;
};

const fetchTagStudents = async (identifier: any, localContext?: any) => {
  const endpoint = localContext
    ? LOCAL_ENDPOINTS.STUDENTS
    : API_ENDPOINTS.STUDENTS;
  const { data } = await Student.find(
    `${endpoint}/tag/${identifier}`,
    localContext
  );
  return data;
};

const fetchCategoryStudents = async (identifier: any, localContext?: any) => {
  const endpoint = localContext
    ? LOCAL_ENDPOINTS.STUDENTS
    : API_ENDPOINTS.STUDENTS;
  const { data } = await Student.find(
    `${endpoint}/category/${identifier}`,
    localContext
  );
  return data;
};

const fetchRelatedStudents = async (
  categoryId: string,
  currentPostId: string,
  ctx: any
) => {
  //Student.find(`${endpoint}?filter=${JSON.stringify(options)}`, localContext);
  const endpoint = ctx ? LOCAL_ENDPOINTS.STUDENTS : API_ENDPOINTS.STUDENTS;
  const response = await Student.find(
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
  fetchStudentsData,
  useStudentsQuery,
  useCreateStudentMutation,
  useUpdateStudentsMutation, 
  useDetailsStudentsInfo,
  useDeleteStudent,
  fetchStudentsDetails,
  fetchCategoryStudents,
  fetchRelatedStudents,
  useUpdateStudentsById
};
