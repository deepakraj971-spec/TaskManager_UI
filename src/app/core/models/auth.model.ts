export interface ApiError {
  statusCode: number;
  message: string;
  errors?: string[]; // optional array of validation errors
}
