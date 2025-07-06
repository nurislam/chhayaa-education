export interface PostsType {
  id: number;
  title: string;
  content: string;
  identifier: string;
  categoryId: number;
  createdBy: string;
  deleted: number;
  createdAt: string;
  updatedAt: string;
  tags?: [];
}

export type PagesType = {
  id: number;
  title: string;
  identifier: string;
  content: string;
  createdBy: string;
  updatedAt: Date;
  createdAt: Date;
  deleted: boolean;
  status: number;
};

export type CoursesType = {
  id: number;
  title: string;
  imageUrl: string;
  price: number;
  rating: number;
  totalLesson: number;
  TotalStudents: number;
  language: string;
  duration: string;
};
