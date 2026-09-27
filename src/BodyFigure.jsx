import { REGIONS } from './data';

/**
 * Stylized front-body SVG with three visual layers + heat tint per region.
 * Click a region to select it.
 */
export default function BodyFigure({
  layer = 'muscle',
  heat = {},
  selected,
  onSelect,
}) {
  const fill = (id, base) => {
    const h = heat[id] || 0;
    if (h < 0.05) return base;
    // blend toward warm zinc/amber load
    const a = Math.min(0.75, 0.15 + h * 0.6);
    return `color-mix(in srgb, #e59a3a ${Math.round(a * 100)}%, ${base})`;
  };

  const bone = layer === 'bone';
  const skin = layer === 'skin';
  const muscle = layer === 'muscle';

  const regionProps = (id) => ({
    className: `body-region ${selected === id ? 'is-selected' : ''}`,
    onClick: (e) => {
      e.stopPropagation();
      onSelect?.(id);
    },
    style: { cursor: 'pointer' },
  });

  return (
    <div className="body-stage">
      <svg viewBox="0 0 200 420" className="body-svg" aria-label="Body atlas figure">
        {/* silhouette shadow */}
        <ellipse cx="100" cy="400" rx="42" ry="8" fill="rgba(0,0,0,0.06)" />

        {/* Skin layer — soft outer */}
        <g opacity={skin ? 1 : bone ? 0.12 : 0.35} style={{ pointerEvents: skin ? 'auto' : 'none' }}>
          <ellipse cx="100" cy="42" rx="22" ry="26" fill={fill('head', '#e8e4df')} {...regionProps('head')} />
          <path
            d="M78 68 Q100 78 122 68 L128 120 Q100 128 72 120 Z"
            fill={fill('shoulders', '#e4e0db')}
            {...regionProps('shoulders')}
          />
          <path d="M72 118 L128 118 L124 175 L76 175 Z" fill={fill('chest', '#e2ded9')} {...regionProps('chest')} />
          <path d="M76 175 L124 175 L120 230 L80 230 Z" fill={fill('core', '#dfdbd6')} {...regionProps('core')} />
          <path d="M80 228 L120 228 L118 255 L82 255 Z" fill={fill('hips', '#ddd9d4')} {...regionProps('hips')} />
          <path d="M82 254 L98 254 L96 340 L84 340 Z" fill={fill('legs', '#dbd7d2')} {...regionProps('legs')} />
          <path d="M102 254 L118 254 L116 340 L104 340 Z" fill={fill('legs', '#dbd7d2')} {...regionProps('legs')} />
          <path d="M84 338 L96 338 L95 385 L86 385 Z" fill={fill('calves', '#d8d4cf')} {...regionProps('calves')} />
          <path d="M104 338 L116 338 L114 385 L105 385 Z" fill={fill('calves', '#d8d4cf')} {...regionProps('calves')} />
          <path d="M52 78 L72 90 L68 160 L48 155 Z" fill={fill('arms', '#e0dcd7')} {...regionProps('arms')} />
          <path d="M148 78 L128 90 L132 160 L152 155 Z" fill={fill('arms', '#e0dcd7')} {...regionProps('arms')} />
        </g>

        {/* Muscle layer */}
        <g opacity={muscle ? 1 : 0} style={{ pointerEvents: muscle ? 'auto' : 'none' }}>
          <ellipse cx="100" cy="42" rx="20" ry="24" fill={fill('head', '#c8c4c0')} stroke="#a1a1aa" strokeWidth="0.6" {...regionProps('head')} />
          <path d="M80 70 Q100 82 120 70 L125 115 Q100 122 75 115 Z" fill={fill('shoulders', '#b8b4b0')} stroke="#a1a1aa" strokeWidth="0.5" {...regionProps('shoulders')} />
          <path d="M75 112 L125 112 L121 168 L79 168 Z" fill={fill('chest', '#b0aca8')} stroke="#a1a1aa" strokeWidth="0.5" {...regionProps('chest')} />
          <path d="M88 112 L112 112 L110 168 L90 168 Z" fill={fill('back', '#a8a4a0')} opacity="0.85" {...regionProps('back')} />
          <path d="M79 168 L121 168 L117 222 L83 222 Z" fill={fill('core', '#aba7a3')} stroke="#a1a1aa" strokeWidth="0.5" {...regionProps('core')} />
          <path d="M83 220 L117 220 L115 248 L85 248 Z" fill={fill('hips', '#a6a29e')} {...regionProps('hips')} />
          <path d="M85 246 L97 246 L95 330 L87 330 Z" fill={fill('legs', '#a3a09c')} stroke="#a1a1aa" strokeWidth="0.4" {...regionProps('legs')} />
          <path d="M103 246 L115 246 L113 330 L105 330 Z" fill={fill('legs', '#a3a09c')} stroke="#a1a1aa" strokeWidth="0.4" {...regionProps('legs')} />
          <path d="M87 328 L95 328 L94 372 L88 372 Z" fill={fill('calves', '#9e9a96')} {...regionProps('calves')} />
          <path d="M105 328 L113 328 L112 372 L106 372 Z" fill={fill('calves', '#9e9a96')} {...regionProps('calves')} />
          <path d="M55 82 L74 92 L70 155 L52 150 Z" fill={fill('arms', '#b5b1ad')} stroke="#a1a1aa" strokeWidth="0.4" {...regionProps('arms')} />
          <path d="M145 82 L126 92 L130 155 L148 150 Z" fill={fill('arms', '#b5b1ad')} stroke="#a1a1aa" strokeWidth="0.4" {...regionProps('arms')} />
        </g>

        {/* Bone layer — schematic */}
        <g opacity={bone ? 1 : 0} style={{ pointerEvents: bone ? 'auto' : 'none' }} fill="none" stroke="#71717a" strokeWidth="1.4" strokeLinecap="round">
          <ellipse cx="100" cy="42" rx="14" ry="16" {...regionProps('head')} />
          <line x1="100" y1="58" x2="100" y2="95" />
          <line x1="100" y1="78" x2="62" y2="95" />
          <line x1="100" y1="78" x2="138" y2="95" />
          <line x1="62" y1="95" x2="55" y2="150" />
          <line x1="138" y1="95" x2="145" y2="150" />
          <line x1="100" y1="95" x2="100" y2="220" />
          <line x1="100" y1="220" x2="88" y2="330" />
          <line x1="100" y1="220" x2="112" y2="330" />
          <line x1="88" y1="330" x2="90" y2="375" />
          <line x1="112" y1="330" x2="110" y2="375" />
          {/* invisible hit targets for bone mode */}
          <rect x="86" y="28" width="28" height="32" fill="transparent" stroke="none" {...regionProps('head')} />
          <rect x="70" y="70" width="60" height="40" fill="transparent" stroke="none" {...regionProps('shoulders')} />
          <rect x="78" y="110" width="44" height="55" fill="transparent" stroke="none" {...regionProps('chest')} />
          <rect x="82" y="165" width="36" height="55" fill="transparent" stroke="none" {...regionProps('core')} />
          <rect x="84" y="245" width="32" height="90" fill="transparent" stroke="none" {...regionProps('legs')} />
        </g>

        {selected && (
          <text x="100" y="412" textAnchor="middle" className="body-label">
            {REGIONS.find((r) => r.id === selected)?.label || selected}
          </text>
        )}
      </svg>
    </div>
  );
}
