import clsx from "clsx";
import type { ReactNode } from "react";

export default function Card({
  title,
  children,
  className,
}: {
  title?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "w-full grow rounded-md bg-neutral-950 p-4 border border-neutral-900",
        className
      )}
    >
      {title ? (
        <div className="flex justify-between pb-3 mb-3 items-center border-b border-neutral-900">
          <h2 className="text-lg font-semibold text-neutral-200">{title}</h2>
        </div>
      ) : null}
      {children}
    </div>
  );
}
