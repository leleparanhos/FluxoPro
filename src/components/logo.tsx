interface LogoProps {
  size?: number;
}

/** Logotipo do FluxoPro: barras ascendentes em um quadro arredondado. */
export function Logo({ size = 40 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect width="48" height="48" rx="13" fill="var(--primary)" />
      <path
        d="M13 33v-8"
        stroke="var(--primary-foreground)"
        strokeWidth="4.5"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M24 33V15"
        stroke="var(--primary-foreground)"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <path
        d="M35 33v-12"
        stroke="var(--primary-foreground)"
        strokeWidth="4.5"
        strokeLinecap="round"
        opacity="0.8"
      />
    </svg>
  );
}
