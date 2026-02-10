/**
 * Utilities for enforcing integer-only cm height inputs while allowing decimals for imperial.
 */

/**
 * Sanitize a height input value to remove decimal points for cm, allow for imperial
 */
export function sanitizeHeightInput(value: string, unit: 'cm' | 'in'): string {
  if (unit === 'in') {
    // Allow decimals for imperial
    return value;
  }
  
  // For cm, remove any decimal points and keep only digits
  return value.replace(/[.,]/g, '');
}

/**
 * Block decimal separator keys for cm inputs
 */
export function handleHeightKeyDown(e: React.KeyboardEvent<HTMLInputElement>, unit: 'cm' | 'in'): void {
  if (unit === 'cm' && (e.key === '.' || e.key === ',')) {
    e.preventDefault();
  }
}

/**
 * Format height value for display (no decimals for cm, allow for imperial)
 */
export function formatHeightDisplay(value: number, unit: 'cm' | 'in'): string {
  if (unit === 'cm') {
    return Math.round(value).toString();
  }
  return value.toFixed(1);
}

/**
 * Parse height input string to number (rounds cm to integer)
 */
export function parseHeightInput(value: string, unit: 'cm' | 'in'): number {
  const num = parseFloat(value);
  if (isNaN(num)) return 0;
  
  if (unit === 'cm') {
    return Math.round(num);
  }
  return num;
}
