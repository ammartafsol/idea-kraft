"use client";

import { Slide, toast, type ToastOptions, type TypeOptions } from "react-toastify";

const TOAST_ID = "app-toast";

type RenderToastProps = ToastOptions & {
  type?: TypeOptions;
  message?: string;
};

/**
 * Shows (or updates) the app's single toast. Same call style as before:
 *   RenderToast({ type: "success", message: "Saved" })
 * Reusing one toast id means rapid actions update the visible toast instead of stacking.
 * The theme follows the site's light/dark mode at the moment it's shown.
 */
export default function RenderToast({ type = "error", message = "Something went wrong. Please try again.", ...props }: RenderToastProps) {
  if (typeof window === "undefined") return null;

  const options: ToastOptions = {
    position: "top-right",
    autoClose: 2500,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: document.documentElement.dataset.theme === "dark" ? "dark" : "light",
    transition: Slide,
    ...props,
  };

  if (toast.isActive(TOAST_ID)) {
    toast.update(TOAST_ID, { ...options, render: message, type });
  } else {
    toast(message, { ...options, type, toastId: TOAST_ID });
  }
  return null;
}
