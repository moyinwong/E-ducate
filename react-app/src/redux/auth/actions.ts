interface ILoginProcessing {
  type: "@@AUTH/LOGIN_PROCESSING";
}

interface ILoginSuccess {
  type: "@@AUTH/LOGIN_SUCCESS";
  token: string;
}

interface ILoginFail {
  type: "@@AUTH/LOGIN_FAIL";
  message: string;
}

interface IGetUser {
  type: "@@AUTH/GET_USER";
  userEmail: string;
}

interface ILogout {
  type: "@@AUTH/LOGOUT";
}

export function loginSuccess(token: string): ILoginSuccess {
  return {
    type: "@@AUTH/LOGIN_SUCCESS" as "@@AUTH/LOGIN_SUCCESS",
    token: token,
  };
}

export function getUser(userEmail: string): IGetUser {
  return {
    type: "@@AUTH/GET_USER" as "@@AUTH/GET_USER",
    userEmail,
  };
}

export function logout(): ILogout {
  return {
    type: "@@AUTH/LOGOUT" as "@@AUTH/LOGOUT",
  };
}

export function loginFail(message: string): ILoginFail {
  return {
    type: "@@AUTH/LOGIN_FAIL" as "@@AUTH/LOGIN_FAIL",
    message,
  };
}

export const loginProcessing = (): ILoginProcessing => {
  return {
    type: "@@AUTH/LOGIN_PROCESSING",
  };
};

type AuthAction =
  | typeof loginSuccess
  | typeof getUser
  | typeof logout
  | typeof loginFail
  | typeof loginProcessing;

export type IAuthAction = ReturnType<AuthAction>;