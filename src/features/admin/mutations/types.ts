export type AdminActionResult =
  | { ok: true; message: string }
  | { ok: false; message: string; fieldErrors?: Record<string, string> };

export const initialAdminActionResult: AdminActionResult = { ok: true, message: "" };
