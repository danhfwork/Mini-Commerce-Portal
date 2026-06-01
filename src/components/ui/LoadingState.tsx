type LoadingStateProps = {
  label?: string;
};

export function LoadingState({ label = "Loading" }: LoadingStateProps) {
  return (
    <div className="rounded-md border border-emerald-100 bg-white p-6 text-sm font-semibold text-emerald-800">
      {label}
    </div>
  );
}
