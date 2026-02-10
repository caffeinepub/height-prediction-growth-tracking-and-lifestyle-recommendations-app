/**
 * Maintenance mode configuration
 * Reads VITE_MAINTENANCE_MODE environment variable and normalizes it to a boolean
 */

function parseMaintenanceMode(): boolean {
  const value = import.meta.env.VITE_MAINTENANCE_MODE;
  
  if (!value) return false;
  
  const normalized = String(value).toLowerCase().trim();
  
  // Truthy values
  if (['true', '1', 'on', 'yes'].includes(normalized)) {
    return true;
  }
  
  // Falsy values
  if (['false', '0', 'off', 'no'].includes(normalized)) {
    return false;
  }
  
  // Default to false for unknown values
  return false;
}

export const isMaintenanceMode = parseMaintenanceMode();
