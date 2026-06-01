type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-md border border-dashed border-emerald-200 bg-white p-8 text-center">
      <h2 className="text-base font-bold text-emerald-950">{title}</h2>
      <p className="mt-2 text-sm text-emerald-800/80">{description}</p>
    </div>
  );
}
