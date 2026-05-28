type ErrorStateProps = {
  title: string;
  description: string;
  action?: React.ReactNode;
};

export function ErrorState({ title, description, action }: ErrorStateProps) {
  return (
    <div className="rounded-md border border-red-200 bg-red-50 p-8 text-center">
      <h2 className="text-base font-semibold text-red-950">{title}</h2>
      <p className="mt-2 text-sm text-red-700">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
