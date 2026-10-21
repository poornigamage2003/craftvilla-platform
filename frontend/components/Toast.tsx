"use client";

import { useToastStore } from "@/lib/store/toastStore";

export default function Toast() {
  const { message, isOpen } = useToastStore();

  return (
    <div
      id="toast"
      role="status"
      aria-live="polite"
      className={`toast ${isOpen ? "show" : ""}`}
    >
      <span>{message}</span>
    </div>
  );
}
