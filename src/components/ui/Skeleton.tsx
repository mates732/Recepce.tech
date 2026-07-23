interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  style?: React.CSSProperties;
}

export default function Skeleton({ className, width, height, style }: SkeletonProps) {
  return (
    <div
      className={`skeleton ${className ?? ""}`}
      style={{
        width,
        height,
        ...style,
      }}
    />
  );
}
