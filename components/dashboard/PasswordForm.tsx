"use client";

import { useActionState } from "react";
import { updatePassword } from "@/app/(dashboard)/app/pengaturan/password/actions";

export function PasswordForm() {
  const [state, action, pending] = useActionState(updatePassword, {});
  return (
    <form action={action} className="stack" noValidate>
      <div className="field">
        <label className="label" htmlFor="password">Password baru</label>
        <input id="password" name="password" type="password" className="input" autoComplete="new-password" aria-describedby="password-hint" />
        <p id="password-hint" className="hint">Minimal 8 karakter.</p>
      </div>
      <div className="field">
        <label className="label" htmlFor="confirm">Ulangi password</label>
        <input id="confirm" name="confirm" type="password" className="input" autoComplete="new-password" />
      </div>
      {state.error && <p className="field-error" role="alert">{state.error}</p>}
      <button type="submit" className="btn btn-primary btn-block btn-center" disabled={pending}>{pending ? "Menyimpan…" : "Simpan password"}</button>
    </form>
  );
}
