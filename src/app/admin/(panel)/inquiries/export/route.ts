import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/admin/session";
import { getAllInquiries } from "@/lib/admin/analytics";

/** Downloads every enquiry as CSV (Excel/Sheets-friendly). Auth is checked here too, not only in the proxy. */
export async function GET() {
  if (!(await getAdmin())) return new NextResponse("Unauthorized", { status: 401 });

  const rows = await getAllInquiries();
  const header = ["Date (UTC)", "Status", "Name", "Email", "Company", "Project type", "Budget", "Country", "Message"];
  const cell = (v: string) => {
    // Neutralise spreadsheet formulas (CSV injection) and quote every cell.
    const safe = /^[=+\-@\t\r]/.test(v) ? `'${v}` : v;
    return `"${safe.replace(/"/g, '""')}"`;
  };
  const lines = [
    header.map(cell).join(","),
    ...rows.map((r) =>
      [new Date(r.createdAt).toISOString(), r.status, r.name, r.email, r.company, r.projectType, r.budget, r.country, r.message]
        .map((v) => cell(String(v ?? "")))
        .join(","),
    ),
  ];

  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(`﻿${lines.join("\r\n")}`, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="novara-inquiries-${date}.csv"`,
      "cache-control": "no-store",
    },
  });
}
