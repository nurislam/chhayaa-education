export declare type Maybe<T> = T | null;
export declare type InputMaybe<T> = Maybe<T>;
/** All built-in and custom scalars, mapped to their actual values */
export declare type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: React.ReactNode;
};

export interface SortOrder {
  name: string;
  apiFormat: string;
}

export declare type LoginInput = {
  email: Scalars["String"];
  password: Scalars["String"];
};

export type UpdateUser = {
  firstName?: Maybe<Scalars["String"]>;
  lastName?: Maybe<Scalars["String"]>;
  email?: Scalars["String"];
  password?: Scalars["String"];
  deleted?: number;
};
export type CreateUser = {
  firstName?: Maybe<Scalars["String"]>;
  lastName?: Maybe<Scalars["String"]>;
  email?: Scalars["String"];
  password?: Scalars["String"];
  role?: Scalars["String"];
}; 

export declare type User = {
  firstName: Scalars["String"];
  is_active: Scalars["Boolean"];
  email: Scalars["String"];
  created_at: Scalars["DateTime"];
  updated_at: Scalars["DateTime"];
};

export type SelectOption = {
  name: string;
  value: string;
};
export type OptionsType = {
  option_name: string;
  option_value: string;
  createdAt: Date;
  status: number;
  deleted: boolean;
};

export type UsersType = {
  id:string;
  firstName: string;
  lastName: string;
  email?: Scalars["String"];
  password?: Scalars["String"];
  expiredPass?: boolean;
  role?: string;
  createdBy: string;
  status?: string;
  createdAt: any;
};

export type GroupsType = {
  id:number;
  name: string;
  createdBy: string;
  createdAt: any;
  status: string;
  deleted: boolean;
  
};
export type ModulesType = {
  id:number;
  name: string;
  createdBy: string;
  createdAt: any;
  status: string;
  deleted: boolean;
  
};

export interface TableHeadType {
  label: string;
  field?: string;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  style?: React.CSSProperties;
}

export declare type ForgotPasswordPostType = {
  email: Scalars["String"];
};

export declare type ResetPasswordPostType = {
  password: Scalars["String"];
  token: Scalars["String"];
};

export type ModuleType = { 
  id?: number;
  name: number;
  slug: string;
  icon: string; 
  createdAt?: Date; 
  createdBy?:string;
  status?:any
  deleted?:boolean
};
export type PermissionType = { 
  id?: number;
  groupId: number;
  moduleId: number;
  actions: string; 
  createdAt?: Date; 
  group?:any;
  module?:any
};
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
