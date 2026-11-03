export function AdminHeader({ title, description, children }: { title: string; description?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6 flex min-w-0 flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <h1 className="font-display text-[1.75rem] leading-tight font-semibold tracking-[-0.03em]">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
      {children && <div className="flex max-w-full min-w-0 flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}
