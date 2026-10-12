"use client";

import { useActionState, useState } from "react";
import {
  sendMagicLink,
  sendPasswordReset,
  signInWithGoogle,
  signInWithPassword,
  signUpWithPassword,
  type AuthState,
} from "@/app/(dashboard)/masuk/actions";

type Mode = "masuk" | "daftar" | "tautan" | "lupa";

const modes: { id: Mode; label: string }[] = [
  { id: "masuk", label: "Password" },
  { id: "tautan", label: "Tautan" },
  { id: "daftar", label: "Daftar" },
];

const initial: AuthState = {};

export function LoginForm({ next, disabled }: { next: string; disabled: boolean }) {
  const [mode, setMode] = useState<Mode>("masuk");
  const [signInState, signIn, signingIn] = useActionState(signInWithPassword, initial);
  const [signUpState, signUp, signingUp] = useActionState(signUpWithPassword, initial);
  const [linkState, sendLink, sendingLink] = useActionState(sendMagicLink, initial);
  const [resetState, sendReset, sendingReset] = useActionState(sendPasswordReset, initial);

  const state = { masuk: signInState, daftar: signUpState, tautan: linkState, lupa: resetState }[mode];
  const pending = { masuk: signingIn, daftar: signingUp, tautan: sendingLink, lupa: sendingReset }[mode];
  const action = { masuk: signIn, daftar: signUp, tautan: sendLink, lupa: sendReset }[mode];
  const submitLabel = {
    masuk: "Masuk",
    daftar: "Buat akun",
    tautan: "Kirim tautan masuk",
    lupa: "Kirim tautan atur ulang",
  }[mode];

  return (
    <div className="stack">
      <form action={signInWithGoogle}>
        <input type="hidden" name="next" value={next} />
        <button type="submit" className="btn btn-block btn-center" disabled={disabled}>Lanjut dengan Google</button>
      </form>

      <p className="divider-text"><span>atau dengan email</span></p>

      {mode !== "lupa" && (
        <div className="tabs tabs-3" role="tablist" aria-label="Metode masuk">
          {modes.map((m) => (
            <button key={m.id} type="button" role="tab" aria-selected={mode === m.id} className="tab" onClick={() => setMode(m.id)}>
              {m.label}
            </button>
          ))}
        </div>
      )}

      <form action={action} className="stack" noValidate>
        <input type="hidden" name="next" value={next} />
        {mode === "lupa" && <p className="hint">Masukkan email akun. Kami kirim tautan untuk membuat password baru.</p>}
        {mode === "daftar" && (
          <div className="field">
            <label className="label" htmlFor="full_name">Nama</label>
            <input id="full_name" name="full_name" className="input" autoComplete="name" disabled={disabled} />
          </div>
        )}
        <div className="field">
          <label className="label" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" className="input" autoComplete="email" inputMode="email"
            placeholder="nama@contoh.com" disabled={disabled} />
        </div>
        {(mode === "masuk" || mode === "daftar") && (
          <div className="field">
            <label className="label" htmlFor="password">Password</label>
            <input id="password" name="password" type="password" className="input" disabled={disabled}
              autoComplete={mode === "daftar" ? "new-password" : "current-password"}
              aria-describedby={mode === "daftar" ? "password-hint" : undefined} />
            {mode === "daftar" && <p id="password-hint" className="hint">Minimal 8 karakter.</p>}
          </div>
        )}

        {state.error && <p className="field-error" role="alert">{state.error}</p>}
        {state.message && <p className="notice" role="status">{state.message}</p>}

        <button type="submit" className="btn btn-primary btn-block btn-center" disabled={disabled || pending}>
          {pending ? "Memproses…" : submitLabel}
        </button>
      </form>

      {mode === "masuk" && <button type="button" className="back-link" onClick={() => setMode("lupa")}>Lupa password?</button>}
      {mode === "lupa" && <button type="button" className="back-link" onClick={() => setMode("masuk")}>Kembali ke masuk</button>}
    </div>
  );
}
