import { UpdateUser, CreateUser, LoginInput } from "@utils/generated";
import http from "@utils/api/http";
import Base from "./base";

class User extends Base<CreateUser, UpdateUser> {
  constructor(ignoreAuthFailure?: boolean) {
    super(ignoreAuthFailure);
  }

  me = async (url: string) => {
    return this.http(url, "get");
  };

  login = async (url: string, variables: LoginInput) => {
    return this.http<LoginInput>(url, "post", variables);
  };

  patchRequest = async (url: string, variables: object) => {
    return http.patch(url, variables);
  };

  logout = async (url: string) => {
    return http.post(url);
  };
}

export const UserIgnoreAuthFailure = new User(true);
const userInstance = new User(); 

export default userInstance;
