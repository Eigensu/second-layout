import Link from "next/link";
import { ReactNode } from "react";
import { Trophy, Star, Play } from "lucide-react";

type Action = {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
};

export default function EmptyState({
  title = "No items",
  description = "Nothing to show here yet.",
  icon,
  primaryAction,
  secondaryAction,
}: {
  title?: string;
  description?: string;
  icon?: ReactNode;
  primaryAction?: Action;
  secondaryAction?: Action;
}) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white/80 px-6 py-10 text-center shadow-sm">
      <div className="mx-auto w-24 h-24 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center mb-4">
        {icon ?? <Trophy className="w-10 h-10" />}
      </div>
      <div className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{title}</div>
      <div className="text-sm text-gray-600 mb-6 max-w-xl mx-auto">{description}</div>

      <div className="flex gap-3 justify-center">
        {primaryAction && primaryAction.href && (
          <Link
            href={primaryAction.href}
            className={`inline-flex items-center px-5 py-2.5 rounded-full font-semibold shadow-sm transition ${
              primaryAction.variant === "secondary"
                ? "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                : "bg-gradient-primary text-white hover:opacity-95"
            }`}
          >
            {primaryAction.label}
          </Link>
        )}
        {secondaryAction && secondaryAction.href && (
          <Link
            href={secondaryAction.href}
            className="inline-flex items-center px-5 py-2.5 rounded-full font-semibold border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
          >
            {secondaryAction.label}
          </Link>
        )}
        {primaryAction && primaryAction.onClick && (
          <button
            onClick={primaryAction.onClick}
            className={`inline-flex items-center px-5 py-2.5 rounded-full font-semibold shadow-sm transition ${
              primaryAction.variant === "secondary"
                ? "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                : "bg-gradient-primary text-white hover:opacity-95"
            }`}
          >
            {primaryAction.label}
          </button>
        )}
      </div>
    </div>
  );
}
