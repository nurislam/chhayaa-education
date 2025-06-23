import Cookie from "js-cookie"; 
import { AUTH_CRED, ROLES } from "./constants"; 

export interface AuthCredentials {
  token: string;
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  groupId: number;
  permissions: string[];
}

export const allowedRoles = [
  ROLES.SUPER_ADMIN,
  ROLES.ADMIN,
  ROLES.VENDOR,
  ROLES.ACCOUNT,
  ROLES.GUEST,
];
export const adminAndOwnerOnly = [ROLES.SUPER_ADMIN, ROLES.ADMIN];
export const vendorRole = [
  ROLES.SUPER_ADMIN,
  ROLES.ADMIN,
  ROLES.GUEST,
  ROLES.VENDOR,
];
export const adminOnly = [ROLES.ADMIN, ROLES.ADMIN];
export const vendorOnly = [ROLES.ADMIN, ROLES.VENDOR];

export function setAuthCredentials(
  id: string,
  email: string,
  firstName: string,
  lastName: string,
  expiredPass: string,
  token: string,
  groupId: number,
  permissions: string[]
) {
  Cookie.set(
    AUTH_CRED,
    JSON.stringify({
      id,
      email,
      firstName,
      lastName,
      expiredPass,
      token,
      groupId,
      permissions,
    }),
    {
      expires: 14,
    }
  );
}

export function getAuthCredentials(context?: any): AuthCredentials | null {
  if (context) {
    return context;
  }
  const authCred = Cookie.get(AUTH_CRED);

  if (authCred) {
    return JSON.parse(authCred);
  } else {
    return null;
  }
}


// export function parseSSRCookie(context: any) {
//   return SSRCookie.parse(context.req.headers.cookie ?? "");
// }

export function hasAccess(
  _allowedRoles: string[],
  _userPermissions: string[] | undefined | null
) {
  if (_userPermissions) {
    return Boolean(
      _allowedRoles?.find((aRole) => _userPermissions.includes(aRole))
    );
  }
  return false;
}

export function isAuthenticated(credentials: AuthCredentials | null) {
  return (
    credentials &&
    credentials.token &&
    credentials.permissions &&
    credentials.permissions.length > 0
  );
}

// export async function isPemitted(
//   moduleId: number,
//   credentials?: AuthCredentials | null
// ) {
//   const data = await getModuleByIds([moduleId], 2);

//   return data;
// }
