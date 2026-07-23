import { forwardRef, type ReactNode } from "react";
import { spacing } from "@/design/tokens";

interface ContainerProps {
  children: ReactNode;
  narrow?: boolean;
  className?: string;
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ children, narrow, className }, ref) => {
    return (
      <div
        ref={ref}
        className={`mx-auto w-full ${className ?? ""}`}
        style={{ maxWidth: narrow ? spacing.container.narrow : spacing.container.maxWidth }}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = "Container";

export default Container;
