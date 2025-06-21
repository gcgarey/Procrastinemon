import type { SVGProps } from "react";

const NeutralDemon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    {...props}
    className={`pixel-corners ${props.className || ''}`}
    style={{ imageRendering: 'pixelated' }}
  >
    <path fill="hsl(var(--primary))" d="M9 9h14v14H9z" />
    <path fill="hsl(var(--foreground))" d="M10 9h1v1h1v1h1v1h-1v-1h-1v-1h-1v1h1v1h-1v-1h-1v1H9v-1h1zm12 0h1v1h1v1h1v1h-1v-1h-1v-1h-1v1h1v1h-1v-1h-1v1h-1v-1h1z" />
    <path fill="hsl(var(--foreground))" d="M13 15h2v2h-2zm4 0h2v2h-2z" />
    <path fill="hsl(var(--foreground))" d="M12 21h8v1h-8z" />
    <path fill="hsl(var(--background))" d="M14 16h-1v-1h1zm4 0h-1v-1h1z" />
  </svg>
);

export default NeutralDemon;
