// VELORA logo (interlocking diamonds + wordmark).
// Uses currentColor for the diamond outline and wordmark, so it automatically
// follows the text colour of wherever it is placed (header, footer, etc.).
type LogoProps = {
  className?: string;
  tagline?: boolean;
  accent?: string;
};

export default function Logo({ className = "", tagline = true, accent = "#B08D3C" }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="165 46 345 76"
      className={className}
      role="img"
      aria-label="VELORA Menswear"
      fill="none"
    >
      <polygon points="170,85 195,55 220,85 195,115" stroke="currentColor" strokeWidth={2} />
      <polygon points="190,85 215,55 240,85 215,115" stroke={accent} strokeWidth={2} />
      <text
        x="265"
        y="98"
        fontFamily="Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif"
        fontWeight={300}
        fontSize={36}
        letterSpacing={10}
        fill="currentColor"
      >
        VELORA
      </text>
      {tagline && (
        <text
          x="267"
          y="121"
          fontFamily="Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif"
          fontSize={11}
          letterSpacing={7}
          fill={accent}
        >
          MENSWEAR
        </text>
      )}
    </svg>
  );
}
