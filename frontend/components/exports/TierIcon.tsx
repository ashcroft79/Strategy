'use client';

import React from 'react';
import Image from 'next/image';

/**
 * Available icon types for tiers and horizons
 */
export type TierIconType =
  | 'vision'
  | 'mission'
  | 'values'
  | 'behaviours'
  | 'drivers'
  | 'intents'
  | 'enablers'
  | 'commitments'
  | 'team'
  | 'individual'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'logo';

/**
 * Icon sizes in pixels
 */
const ICON_SIZES = {
  xs: 12,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
} as const;

type IconSize = keyof typeof ICON_SIZES;

/**
 * Map tier names to icon types
 */
export function getTierIconType(tierName: string): TierIconType | null {
  const mapping: Record<string, TierIconType> = {
    vision: 'vision',
    mission: 'mission',
    foundation: 'vision',
    values: 'values',
    behaviours: 'behaviours',
    behaviors: 'behaviours',
    drivers: 'drivers',
    strategic_drivers: 'drivers',
    intents: 'intents',
    strategic_intents: 'intents',
    enablers: 'enablers',
    commitments: 'commitments',
    iconic_commitments: 'commitments',
    team: 'team',
    team_objectives: 'team',
    individual: 'individual',
    individual_objectives: 'individual',
  };
  return mapping[tierName.toLowerCase()] || null;
}

/**
 * Map horizon to icon type
 */
export function getHorizonIconType(horizon: string): TierIconType {
  const mapping: Record<string, TierIconType> = {
    H1: 'h1',
    H2: 'h2',
    H3: 'h3',
  };
  return mapping[horizon.toUpperCase()] || 'commitments';
}

interface TierIconProps {
  /** The type of icon to display */
  type: TierIconType;
  /** Size of the icon */
  size?: IconSize;
  /** Additional CSS classes */
  className?: string;
  /** Custom color (CSS color value) */
  color?: string;
  /** Alt text for accessibility */
  alt?: string;
}

/**
 * TierIcon component for displaying tier and horizon icons.
 *
 * Uses SVG icons from the public/icons/export directory.
 *
 * @example
 * ```tsx
 * <TierIcon type="vision" size="md" />
 * <TierIcon type="h1" size="sm" color="#27ae60" />
 * ```
 */
export const TierIcon: React.FC<TierIconProps> = ({
  type,
  size = 'md',
  className = '',
  color,
  alt,
}) => {
  const pixelSize = ICON_SIZES[size];
  const iconPath = type === 'logo'
    ? '/icons/export/strategy-pyramid-logo.svg'
    : `/icons/export/icon-${type}.svg`;

  // For the logo, we use different dimensions
  const logoWidth = type === 'logo' ? 120 : pixelSize;
  const logoHeight = type === 'logo' ? 100 : pixelSize;

  return (
    <span
      className={`tier-icon tier-icon-${type} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: logoWidth,
        height: logoHeight,
        ...(color ? { color } : {}),
      }}
    >
      <Image
        src={iconPath}
        alt={alt || `${type} icon`}
        width={logoWidth}
        height={logoHeight}
        className="tier-icon-image"
        style={{
          filter: color ? `drop-shadow(0 0 0 ${color})` : undefined,
        }}
      />
    </span>
  );
};

/**
 * HorizonBadge component for displaying horizon indicators with color coding.
 */
interface HorizonBadgeProps {
  horizon: 'H1' | 'H2' | 'H3';
  size?: IconSize;
  showLabel?: boolean;
  className?: string;
}

const HORIZON_COLORS = {
  H1: '#27ae60', // Green
  H2: '#3498db', // Blue
  H3: '#e67e22', // Orange
} as const;

const HORIZON_LABELS = {
  H1: '0-12 months',
  H2: '12-24 months',
  H3: '24-36 months',
} as const;

export const HorizonBadge: React.FC<HorizonBadgeProps> = ({
  horizon,
  size = 'sm',
  showLabel = false,
  className = '',
}) => {
  const color = HORIZON_COLORS[horizon];
  const pixelSize = ICON_SIZES[size];

  return (
    <span
      className={`horizon-badge horizon-badge-${horizon.toLowerCase()} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '2px 8px',
        borderRadius: '4px',
        backgroundColor: `${color}20`,
        color: color,
        fontSize: `${pixelSize * 0.5}px`,
        fontWeight: 600,
      }}
    >
      <TierIcon type={getHorizonIconType(horizon)} size="xs" />
      <span>{horizon}</span>
      {showLabel && (
        <span style={{ opacity: 0.8, fontWeight: 400 }}>
          ({HORIZON_LABELS[horizon]})
        </span>
      )}
    </span>
  );
};

export default TierIcon;
