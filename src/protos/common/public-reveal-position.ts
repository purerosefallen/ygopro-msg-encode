import { OcgcoreCommonConstants } from '../../vendor/ocgcore-constants';

export interface PublicRevealPosition {
  position?: number;
  reveal?: boolean;
}

export interface PublicRevealViewSanitizeOptions {
  stripRevealFlag: boolean;
  omitRevealField: boolean;
}

export const LegacyPublicRevealViewSanitizeOptions: PublicRevealViewSanitizeOptions =
  {
    stripRevealFlag: true,
    omitRevealField: true,
  };

export function stripRevealFromPosition(position: number): number {
  return (position & ~OcgcoreCommonConstants.POS_REVEAL) & 0xff;
}

export function decodePublicRevealPosition<T extends PublicRevealPosition>(
  target: T,
  rawPosition = target.position,
): T {
  if (typeof rawPosition !== 'number') {
    return target;
  }
  const position = rawPosition & 0xff;
  target.position = stripRevealFromPosition(position);
  if (position & OcgcoreCommonConstants.POS_REVEAL) {
    target.reveal = true;
  } else {
    delete target.reveal;
  }
  return target;
}

export function encodePublicRevealPosition(
  position?: number,
  reveal?: boolean,
): number {
  const stripped = stripRevealFromPosition(position || 0);
  if (reveal === true) {
    return (stripped | OcgcoreCommonConstants.POS_REVEAL) & 0xff;
  }
  return stripped;
}

export function sanitizePublicRevealPositionForView<
  T extends PublicRevealPosition,
>(
  target?: T,
  options = LegacyPublicRevealViewSanitizeOptions,
): T | undefined {
  if (!target) {
    return target;
  }
  if (options.stripRevealFlag && typeof target.position === 'number') {
    target.position = stripRevealFromPosition(target.position);
  }
  if (options.omitRevealField) {
    delete target.reveal;
  }
  return target;
}

export function shouldHideFacedownCode(
  position?: number,
  reveal?: boolean,
): boolean {
  return !!(
    position &&
    position & OcgcoreCommonConstants.POS_FACEDOWN &&
    reveal !== true
  );
}
