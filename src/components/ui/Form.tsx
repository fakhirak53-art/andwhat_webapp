"use client";

import type { FormHTMLAttributes, ReactNode } from "react";

/**
 * Form wrapper that sets suppressHydrationWarning so password-manager extensions
 * (e.g. Psono) that inject classes/styles onto <form> do not cause hydration mismatches.
 */
export function Form({
  children,
  ...props
}: FormHTMLAttributes<HTMLFormElement> & { children?: ReactNode }) {
  return (
    <form {...props} suppressHydrationWarning>
      {children}
    </form>
  );
}
