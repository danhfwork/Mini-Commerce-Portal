type LoadingStateProps = {
  label?: string;
};

export function LoadingState({ label = "Loading" }: LoadingStateProps) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-6 text-sm text-slate-600">
      {label}
    </div>
  );
}
