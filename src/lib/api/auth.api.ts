import { apiRequest } from "@/lib/api/client";
import type { AuthUser, LoginResponse } from "@/lib/types/auth";

export type LoginRequest = {
  username: string;
  password: string;
  expiresInMins?: number;
};

export async function login(request: LoginRequest) {
  return apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export async function getCurrentUser(accessToken: string) {
  return apiRequest<AuthUser>("/auth/me", {
    method: "GET",
    accessToken,
  });
}
