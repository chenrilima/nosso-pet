import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Header } from "./Header";

describe("mobile header menu", () => {
  it("starts closed without rendering navigation content in the layout", () => {
    const html = renderToStaticMarkup(<Header businessName="Nosso Pet" whatsappRaw="5511999999999" />);
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('aria-controls="mobile-navigation"');
    expect(html).toContain('aria-label="Abrir menu"');
    expect(html).not.toContain('id="mobile-navigation"');
  });
});
