import { http, unwrap } from "./axios";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from "@/lib/types";

export const authApi = {
  login: (body: LoginRequest) =>
    unwrap<AuthResponse>(http.post("/auth/login", body)),
  register: (body: RegisterRequest) =>
    unwrap<AuthResponse>(http.post("/auth/register", body)),
  me: () => unwrap<User>(http.get("/auth/me")),
  logout: () => unwrap<void>(http.post("/auth/logout")),
};
