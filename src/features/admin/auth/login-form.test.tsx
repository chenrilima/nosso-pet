import type { ReactElement, ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { LoginState } from "./types";

const reactState = vi.hoisted(() => ({
  actionState: { status: "idle" } as LoginState,
  pending: false,
  cursor: 0,
  values: [] as unknown[],
}));

vi.mock("react", async (importOriginal) => {
  const original = await importOriginal<typeof import("react")>();
  return {
    ...original,
    useActionState: () => [reactState.actionState, vi.fn(), reactState.pending],
    useState: <T,>(initialValue: T) => {
      const index = reactState.cursor++;
      if (reactState.values[index] === undefined) reactState.values[index] = initialValue;
      const setValue = (next: T | ((current: T) => T)) => {
        const current = reactState.values[index] as T;
        reactState.values[index] = typeof next === "function"
          ? (next as (value: T) => T)(current)
          : next;
      };
      return [reactState.values[index] as T, setValue] as const;
    },
  };
});

vi.mock("./actions", () => ({ loginAction: vi.fn() }));

import { LoginForm } from "./login-form";

function renderForm() {
  reactState.cursor = 0;
  return LoginForm();
}

type TestElementProps = {
  children?: ReactNode;
  name?: string;
  type?: string;
  value?: string;
  autoComplete?: string;
  onChange?: (event: { currentTarget: { value: string } }) => void;
  onClick?: () => void;
  "aria-label"?: string;
  "aria-pressed"?: boolean;
};

function elements(root: ReactNode): ReactElement<TestElementProps>[] {
  if (!root || typeof root !== "object" || !("props" in root)) return [];
  const element = root as ReactElement<TestElementProps>;
  const children = Array.isArray(element.props.children)
    ? element.props.children
    : [element.props.children];
  return [element, ...children.flatMap(elements)];
}

function input(name: "email" | "password", form = renderForm()) {
  return elements(form).find((element) => element.type === "input" && element.props.name === name)!;
}

function visibilityButton(form = renderForm()) {
  return elements(form).find((element) => element.type === "button" && element.props["aria-pressed"] !== undefined)!;
}

describe("LoginForm", () => {
  beforeEach(() => {
    reactState.actionState = { status: "idle" };
    reactState.pending = false;
    reactState.cursor = 0;
    reactState.values = [];
  });

  it("preserves email and password when an action error rerenders the form", () => {
    const firstRender = renderForm();
    input("email", firstRender).props.onChange?.({ currentTarget: { value: "admin@empresa.com" } });
    input("password", firstRender).props.onChange?.({ currentTarget: { value: "senha-incorreta" } });
    reactState.actionState = { status: "error" };

    const errorRender = renderForm();
    expect(input("email", errorRender).props.value).toBe("admin@empresa.com");
    expect(input("password", errorRender).props.value).toBe("senha-incorreta");
  });

  it("uses autocomplete attributes understood by password managers", () => {
    const form = renderForm();
    expect(input("email", form).props.autoComplete).toBe("username");
    expect(input("password", form).props.autoComplete).toBe("current-password");
  });

  it("alternates the password between hidden and visible without changing its value", () => {
    const firstRender = renderForm();
    input("password", firstRender).props.onChange?.({ currentTarget: { value: "segredo" } });
    visibilityButton(firstRender).props.onClick?.();

    const visibleRender = renderForm();
    expect(input("password", visibleRender).props).toMatchObject({ type: "text", value: "segredo" });
    expect(visibilityButton(visibleRender).props).toMatchObject({ "aria-label": "Ocultar senha", "aria-pressed": true });
    visibilityButton(visibleRender).props.onClick?.();

    const hiddenRender = renderForm();
    expect(input("password", hiddenRender).props).toMatchObject({ type: "password", value: "segredo" });
  });

  it("uses a non-submit, keyboard-accessible visibility button", () => {
    expect(visibilityButton().props).toMatchObject({
      type: "button",
      "aria-label": "Mostrar senha",
      "aria-pressed": false,
    });
  });

  it("does not clear either field while login is pending", () => {
    const firstRender = renderForm();
    input("email", firstRender).props.onChange?.({ currentTarget: { value: "admin@empresa.com" } });
    input("password", firstRender).props.onChange?.({ currentTarget: { value: "segredo" } });
    reactState.pending = true;

    const pendingRender = renderForm();
    expect(input("email", pendingRender).props.value).toBe("admin@empresa.com");
    expect(input("password", pendingRender).props.value).toBe("segredo");
    expect(elements(pendingRender).find((element) => element.type === "button" && element.props.type === "submit")?.props.children).toBe("Entrando…");
  });
});
