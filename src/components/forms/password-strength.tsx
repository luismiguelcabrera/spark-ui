"use client";

import {
  forwardRef,
  type InputHTMLAttributes,
  type ChangeEvent,
} from "react";
import { cn } from "../../lib/utils";
import { useControllable } from "../../hooks/use-controllable";
import { useLocale } from "../../lib/locale";
import { PasswordInput } from "./password-input";
import { Icon } from "../data-display/icon";

// ── Types ───────────────────────────────────────────────────────────────────

type PasswordRule = {
  label: string;
  test: (password: string) => boolean;
};

type PasswordStrengthProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "onChange"
> & {
  error?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  rules?: PasswordRule[];
  hideRules?: boolean;
  hideStrengthBar?: boolean;
  className?: string;
};

// ── Helpers ─────────────────────────────────────────────────────────────────

const strengthColors = [
  "bg-muted", // 0 passing
  "bg-destructive/100", // 1 passing
  "bg-orange-500", // 2 passing
  "bg-warning", // 3 passing
  "bg-success", // 4+ passing
] as const;

const strengthTextColors = [
  "text-muted-foreground", // 0
  "text-destructive", // 1
  "text-orange-500", // 2
  "text-warning", // 3
  "text-success", // 4+
] as const;

function getSegmentCount(score: number): number {
  if (score <= 0) return 0;
  if (score >= 4) return 4;
  return score; // 1, 2, or 3
}

// ── Component ───────────────────────────────────────────────────────────────

const PasswordStrength = forwardRef<HTMLInputElement, PasswordStrengthProps>(
  (
    {
      value,
      defaultValue = "",
      onChange,
      rules: rulesProp,
      hideRules = false,
      hideStrengthBar = false,
      className,
      error,
      id,
      disabled,
      placeholder,
      ...rest
    },
    ref,
  ) => {
    const { t } = useLocale();

    const defaultRules: PasswordRule[] = [
      {
        label: t("password.minLength", "At least 8 characters"),
        test: (pw) => pw.length >= 8,
      },
      {
        label: t("password.uppercase", "One uppercase letter"),
        test: (pw) => /[A-Z]/.test(pw),
      },
      {
        label: t("password.lowercase", "One lowercase letter"),
        test: (pw) => /[a-z]/.test(pw),
      },
      {
        label: t("password.number", "One number"),
        test: (pw) => /\d/.test(pw),
      },
      {
        label: t("password.special", "One special character"),
        test: (pw) => /[^A-Za-z0-9]/.test(pw),
      },
    ];

    const rules = rulesProp ?? defaultRules;

    const [current, update] = useControllable<string>({
      value,
      defaultValue: (defaultValue as string) || "",
      onChange,
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      update(e.target.value);
    };

    // Evaluate rules
    const results = rules.map((rule) => ({
      ...rule,
      passing: current.length > 0 ? rule.test(current) : false,
    }));
    const score = results.filter((r) => r.passing).length;
    const segments = getSegmentCount(score);
    const colorIndex = Math.min(segments, 4);

    // Strength labels
    const strengthLabels = [
      t("password.weak", "Weak"),
      t("password.weak", "Weak"),
      t("password.fair", "Fair"),
      t("password.good", "Good"),
      t("password.strong", "Strong"),
      t("password.veryStrong", "Very strong"),
    ];
    const strengthLabel = strengthLabels[score] ?? strengthLabels[0];

    const hasPassword = current.length > 0;

    return (
      <div className="flex flex-col gap-2">
        <PasswordInput
          ref={ref}
          className={className}
          error={error}
          id={id}
          disabled={disabled}
          placeholder={placeholder}
          value={current}
          onChange={handleChange}
          {...rest}
        />

        {hasPassword && !hideStrengthBar && (
          <div className="flex flex-col gap-1.5">
            {/* Strength bar */}
            <div
              className="flex gap-1"
              role="meter"
              aria-label={t("password.strength", "Password strength")}
              aria-valuemin={0}
              aria-valuemax={4}
              aria-valuenow={segments}
              aria-valuetext={strengthLabel}
            >
              {Array.from({ length: 4 }, (_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1.5 flex-1 rounded-full transition-colors duration-200",
                    i < segments
                      ? strengthColors[colorIndex]
                      : "bg-muted",
                  )}
                />
              ))}
            </div>

            {/* Strength label */}
            <p
              className={cn(
                "text-xs font-medium text-right",
                strengthTextColors[colorIndex],
              )}
              aria-live="polite"
            >
              {strengthLabel}
            </p>
          </div>
        )}

        {hasPassword && !hideRules && (
          <ul className="flex flex-col gap-1" role="list">
            {results.map((rule, i) => (
              <li
                key={i}
                className={cn(
                  "flex items-center gap-2 text-xs transition-colors duration-150",
                  rule.passing ? "text-success" : "text-muted-foreground",
                )}
              >
                <Icon
                  name={rule.passing ? "check_circle" : "circle"}
                  size="sm"
                  aria-hidden="true"
                />
                <span>{rule.label}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  },
);
PasswordStrength.displayName = "PasswordStrength";

export { PasswordStrength };
export type { PasswordStrengthProps, PasswordRule };
