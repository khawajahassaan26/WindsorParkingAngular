export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: Role[];
  permissions: string[];
  isActive: boolean;
  lastLogin?: Date;
  avatar?: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
}

// core/models/auth.models.ts
export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RefreshTokenResponse {
  token: string;
  expiresIn: number;
}
export class UserInfo {
    userId?: number;
    userName?: string | undefined;
    sdpId?: number;
    empId?: number;
    groupId?: number;
}
export class Rights  {
    objectId?: number;
    objectName?: string | undefined;
    canView?: string | undefined;
    canAdd?: string | undefined;
    canEdit?: string | undefined;
    canDelete?: string | undefined;
}
export class LoginInfo {
    companyId?: number | undefined;
    companyName?: string | undefined;
    sdpName?: string | undefined;
    sdpId?: number | undefined;
    posRegId?: number | undefined;
    yearId?: number;
    fyName?: string | undefined;
}

export class LoginResponse {
    success?: boolean;
    message?: string | undefined;
    token?: string | undefined;
    user?: UserInfo;
    isPasswordExpired?: boolean;
    userRights?: Rights[] | undefined;
    accessToken?: string | undefined;
    encryptedAccessToken?: string | undefined;
    expireInSeconds?: number;
    userId?: number;
    userName?: string | undefined;
    loginDetail?: LoginInfo;
}