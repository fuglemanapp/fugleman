// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { beforeEach, expect, it, vi } from "vitest";

import { PublicAuthForm } from "./public-auth-form";

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  })));
});

it("submits registration and shows the verification instruction", async () => {
  const user = userEvent.setup();
  render(<PublicAuthForm mode="register" />);

  await user.type(screen.getByLabelText("Nome"), "Ana");
  await user.type(screen.getByLabelText("E-mail"), "ana@example.com");
  await user.type(screen.getByLabelText("Senha"), "senha-segura12");
  await user.click(screen.getByRole("button", { name: "Criar conta" }));

  expect(await screen.findByText("Confira seu e-mail para ativar a conta.")).toBeTruthy();
  expect(fetch).toHaveBeenCalledWith("/api/auth/register", expect.objectContaining({ method: "POST" }));
});
