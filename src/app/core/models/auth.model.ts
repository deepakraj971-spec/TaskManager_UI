export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

export interface ApiError {
  statusCode: number;
  message: string;
  errors?: string[]; // optional array of validation errors
}
