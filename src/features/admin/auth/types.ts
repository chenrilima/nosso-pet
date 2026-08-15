export type AdminUser = {
  id: string;
  email: string;
  displayName: string | null;
  role: "admin";
};

export type LoginState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"email" | "password", string>>;
};
