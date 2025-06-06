export type AuthenticationState =
  | {
      isAuthenticated: true;
      token: string;
      userId: string;
    }
  | {
      isAuthenticated: false;
    };

export type LoginResponse = {
  jwt: string
};

export type LoginRequestData = {
  username: string;
  password: string;
};