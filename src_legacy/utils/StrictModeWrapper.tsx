import React, { type ReactNode } from "react";

export default function StrictModeWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return import.meta.env.DEV ? (
    <React.StrictMode>{children}</React.StrictMode>
  ) : (
    <>{children}</>
  );
}
