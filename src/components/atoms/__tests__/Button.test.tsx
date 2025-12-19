import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import { Button } from "../Button";

describe("Button", () => {
  it("renders with provided text and variant", () => {
    render(<Button variant="primary">Click me</Button>);
    const btn = screen.getByRole("button", { name: /click me/i });
    expect(btn).toBeInTheDocument();
    expect(btn.className).toContain("btn");
    expect(btn.className).toContain("edit");
  });
});

