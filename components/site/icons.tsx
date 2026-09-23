type IconProps = { className?: string };

export function BoltIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M13 2 4.5 13.5H11l-1 8.5 8.5-11.5H12z" />
    </svg>
  );
}

export function MenuIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  );
}

export function XIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

/** Logo oficial de WhatsApp, colores propios (no hereda currentColor a propósito). */
export function WhatsAppIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <circle cx="12" cy="12" r="12" fill="#25D366" />
      <path
        fill="#FFF"
        d="M12 3.6a8.4 8.4 0 0 0-7.2 12.7L3.6 20.4l4.2-1.1A8.4 8.4 0 1 0 12 3.6m4.9 12c-.2.6-1.2 1.1-1.7 1.2s-1 .1-2.3-.5a8 8 0 0 1-3.4-3 9.2 9.2 0 0 1-1.4-2.5c-.2-.7.1-1.4.5-1.9.2-.2.4-.3.6-.3h.5c.2 0 .4 0 .5.4l.7 1.8c.1.1.1.3 0 .4l-.5.7a.4.4 0 0 0 0 .4 5.9 5.9 0 0 0 2.9 2.5c.2.1.3.1.4-.1l.6-.8c.1-.2.3-.2.5-.1l1.5.7c.2.1.4.2.4.3s0 .7-.3 1.3Z"
      />
    </svg>
  );
}

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function SearchIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4-4" />
    </svg>
  );
}

export function ArrowRightIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className={className}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowLeftIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className={className}>
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  );
}

export function BoltSpecIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M13 2 4.5 13.5H11l-1 8.5 8.5-11.5H12z" />
    </svg>
  );
}

export function SpeedIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
      <path d="M12 12l4-3" />
      <path d="M4 18a8 8 0 1 1 16 0" />
    </svg>
  );
}

export function RangeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <rect x="2" y="8" width="16" height="8" rx="2" />
      <path d="M18 11h2l2 2v1h-4z" />
      <path d="M5 12h6" />
    </svg>
  );
}

export function TruckIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 8h11v8H3z" />
      <path d="M14 11h4l3 3v2h-7z" />
      <circle cx="7" cy="18" r="1.8" />
      <circle cx="17" cy="18" r="1.8" />
    </svg>
  );
}

export function CoinsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 7h16v10H4z" />
      <circle cx="12" cy="12" r="2.4" />
      <path d="M9 12h.01M17 12h.01" />
    </svg>
  );
}

export function ShieldIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

/** Siluetas de vehículo por categoría — placeholder hasta cargar fotos reales. */
export function VehicleIcon({ categoria, className }: { categoria: "monopatin" | "moto" | "bici"; className?: string }) {
  const paths: Record<string, React.ReactNode> = {
    monopatin: (
      <>
        <circle cx="45" cy="118" r="20" />
        <circle cx="162" cy="118" r="20" />
        <path d="M45 118 L150 118" />
        <path d="M150 118 L150 40" />
        <path d="M150 40 L128 40 M150 40 L168 40" />
        <path d="M150 55 L150 40" />
        <path d="M40 108 L100 108 L108 118" />
      </>
    ),
    moto: (
      <>
        <circle cx="46" cy="114" r="22" />
        <circle cx="156" cy="114" r="22" />
        <path d="M46 114 L46 92 Q47 78 66 78 L98 78" />
        <path d="M98 78 L110 106 L138 106" />
        <path d="M138 106 L150 64" />
        <path d="M150 64 L156 114" />
        <path d="M150 58 L132 54 M150 58 L170 54" />
        <path d="M150 64 L150 58" />
      </>
    ),
    bici: (
      <>
        <circle cx="46" cy="112" r="28" />
        <circle cx="158" cy="112" r="28" />
        <path d="M46 112 L96 112 L128 60 L158 112" />
        <path d="M96 112 L118 60 L128 60" />
        <path d="M118 60 L108 52 L94 52" />
        <path d="M128 60 L140 44 L150 44" />
        <path d="M128 60 L134 50" />
        <path d="M78 60 L118 60" />
        <path d="M72 56 L86 56" />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 200 150" fill="none" stroke="currentColor" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" className={className}>
      {paths[categoria]}
    </svg>
  );
}

export function ZoomIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="M16.5 16.5 21 21M11 8v6M8 11h6" />
    </svg>
  );
}
