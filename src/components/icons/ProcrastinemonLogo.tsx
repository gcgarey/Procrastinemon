import type { SVGProps } from "react";

const ProcrastinemonLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
    className={`pixel-corners ${props.className || ''}`}
  >
    <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" fill="hsl(var(--primary))" stroke="hsl(var(--foreground))" />
    <path d="M12 2V12" stroke="hsl(var(--foreground))" />
    <path d="M22 7L12 12" stroke="hsl(var(--foreground))" />
    <path d="M2 7L12 12" stroke="hsl(var(--foreground))" />
    <path d="M7 5L9 7L7 9" stroke="hsl(var(--foreground))" />
    <path d="M17 5L15 7L17 9" stroke="hsl(var(--foreground))" />
    <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" fill="hsl(var(--accent))" stroke="hsl(var(--foreground))" />
  </svg>
);

export default ProcrastinemonLogo;
