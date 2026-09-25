"use client";

interface AdminStarsProps {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
}

export function AdminStars({ value, onChange, size = 15 }: AdminStarsProps) {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);
  const role = onChange ? "radiogroup" : undefined;
  return (
    <span className="adm-stars" role={role} aria-label={`${value} out of 5 stars`}>
      {stars.map((s) =>
        onChange ? (
          <button
            key={s}
            type="button"
            className={`adm-star adm-star--btn${s <= value ? " is-on" : ""}`}
            style={{ width: size, height: size }}
            aria-label={`${s} star${s > 1 ? "s" : ""}`}
            aria-pressed={s <= value}
            onClick={() => onChange(s)}
          >
            ★
          </button>
        ) : (
          <span
            key={s}
            className={`adm-star${s <= value ? " is-on" : ""}`}
            style={{ width: size, height: size }}
            aria-hidden="true"
          >
            ★
          </span>
        )
      )}
    </span>
  );
}