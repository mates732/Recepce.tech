interface Props {
  n: number | string;
  label: string;
}

export default function Index({ n, label }: Props) {
  if (process.env.NODE_ENV === 'production') return null;
  return (
    <div className="text-[10px] font-mono text-red-400/70 mb-1 select-none">
      [{n}] {label}
    </div>
  );
}