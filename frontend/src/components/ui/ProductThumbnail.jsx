import { useState } from 'react';
import { resolveProductImage } from '../../utils/imageUrl';

export default function ProductThumbnail({
  src,
  name = '',
  className = 'product-thumbnail',
  size,
}) {
  const [failed, setFailed] = useState(false);
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map(w => w[0] || '')
    .join('')
    .toUpperCase() || name.slice(0, 2).toUpperCase() || 'CW';

  const style = size ? { width: size, height: size, minWidth: size } : undefined;

  if (!src || failed) {
    return (
      <div className={`${className} thumb-mono-fallback`} style={style} aria-hidden="true">
        <span>{initials}</span>
      </div>
    );
  }

  return (
    <div className={className} style={style}>
      <img
        src={resolveProductImage(src)}
        alt={name}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
