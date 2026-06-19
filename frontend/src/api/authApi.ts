import axiosClient from './axiosClient';

export interface LoginPayload {
  username?: string;
  email?: string;
  password?: string;
}

export interface RegisterPayload {
  username?: string;
  email?: string;
  password?: string;
}

export const authApi = {
  login: async (data: LoginPayload) => {
    // This is a placeholder endpoint. Update when backend is ready.
    const response = await axiosClient.post('/api/users/login', data);
    return response.data;
  },
  
  register: async (data: RegisterPayload) => {
    // Backend endpoint: POST /api/users (CreateUserRequest)
    const response = await axiosClient.post('/api/users', data);
    return response.data;
  }
};
