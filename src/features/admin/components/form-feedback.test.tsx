import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { FieldError, fieldAccessibility } from "./form-feedback";

describe("admin field accessibility", () => {
  it("associates an invalid field with its stable error id", () => {
    const state = { ok: false as const, message: "Revise os campos.", fieldErrors: { phone: "Telefone inválido." } };
    expect(fieldAccessibility(state, "phone", "settings-phone")).toEqual({ id: "settings-phone", "aria-invalid": true, "aria-describedby": "settings-phone-error" });
    expect(renderToStaticMarkup(<FieldError state={state} name="phone" fieldId="settings-phone" />)).toContain('id="settings-phone-error"');
  });

  it("does not announce a valid field as invalid", () => {
    expect(fieldAccessibility({ ok: true, message: "" }, "phone")).toEqual({ id: "phone", "aria-invalid": undefined, "aria-describedby": undefined });
  });
});
