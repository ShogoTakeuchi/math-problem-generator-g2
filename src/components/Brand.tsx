import { Link } from "react-router";

interface BrandProps {
  compact?: boolean;
}

export function Brand({ compact = false }: BrandProps) {
  return (
    <Link className="brand" to="/" aria-label="さんすう島 トップへ">
      <span className="brand-mark" aria-hidden="true">
        <span className="brand-sun" />
        <span className="brand-sail" />
        <span className="brand-wave" />
      </span>
      <span className="brand-copy">
        <strong>さんすう島</strong>
        {!compact && <small>2年生のけいさん</small>}
      </span>
    </Link>
  );
}
