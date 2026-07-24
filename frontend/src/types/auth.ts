export type AuthCredentials = {
  emailOrCpf: string;
  password: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
};

export type AuthResponse = {
  token: string;
  refreshToken?: string;
  user: User;
};
