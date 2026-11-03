"use client";

import { ToastContainer } from "react-toastify";

/** Single toast host for the whole app (site + admin). Styling lives in globals.css (.Toastify variables). */
export function Toaster() {
  return <ToastContainer position="top-right" newestOnTop limit={3} />;
}
