interface BrandLogoProps {
  className?: string;
  size?: number;
}

export function BrandLogo({ className = '', size = 36 }: BrandLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={`shrink-0 ${className}`}
      aria-label="Y. Parfum Emblem"
    >
      <defs>
        <linearGradient id="yParfumGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffd27d" />
          <stop offset="45%" stopColor="#e5a93b" />
          <stop offset="100%" stopColor="#c4851d" />
        </linearGradient>
      </defs>
      <rect
        x="6"
        y="6"
        width="88"
        height="88"
        rx="22"
        fill="#0c0d12"
        stroke="url(#yParfumGoldGrad)"
        strokeWidth="2.5"
      />
      <polygon
        points="50,12 84,26 88,50 84,74 50,88 16,74 12,50 16,26"
        fill="none"
        stroke="url(#yParfumGoldGrad)"
        strokeWidth="1.2"
        strokeOpacity="0.5"
      />
      <path
        d="M50,20 C51.8,23 54.5,26 54.5,29 C54.5,31.5 52.5,33.5 50,33.5 C47.5,33.5 45.5,31.5 45.5,29 C45.5,26 48.2,23 50,20 Z"
        fill="url(#yParfumGoldGrad)"
      />
      <circle cx="41" cy="30" r="2.2" fill="url(#yParfumGoldGrad)" />
      <circle cx="59" cy="30" r="2.2" fill="url(#yParfumGoldGrad)" />
      <path
        d="M31,39 H41 V42 H37.5 L48.5,58 L45.5,59.5 L33.5,42 H31 Z"
        fill="url(#yParfumGoldGrad)"
      />
      <path
        d="M69,39 H59 V42 H62.5 L47.5,63 H52.5 L66.5,42 H69 Z"
        fill="url(#yParfumGoldGrad)"
      />
      <path
        d="M47,60 H53 V74 H58 V77 H42 V74 H47 Z"
        fill="url(#yParfumGoldGrad)"
      />
    </svg>
  );
}
