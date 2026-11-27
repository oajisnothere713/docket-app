export const CREW_DIRECTORY = {
  'EMP-2025-01': { name: 'Ramesh Patil', role: 'BMD Operators' },
  'EMP-2025-02': { name: 'Suresh Yadav', role: 'BMD Operators' },
  'EMP-2025-03': { name: 'Blair Huntingdon', role: 'BMD Operators' },
  'EMP-2025-04': { name: 'CREW B', role: 'BMD Operators' },
  'EMP-2025-05': { name: 'Mike Sullivan', role: 'Blasters / Shotfirers' },
  'EMP-2025-06': { name: 'Dan Brooks', role: 'Blasters / Shotfirers' },
  'EMP-2025-07': { name: 'James Lee', role: 'Surveyors' },
  'EMP-2025-08': { name: 'Priya Sharma', role: 'Surveyors' }
};

/**
 * Resolve an employee ID (e.g. "EMP-2025-02") to the crew member's name.
 * Returns the input unchanged if it is already a name or an unknown ID.
 */
export function getCrewName(idOrName) {
  if (!idOrName) return '';
  const key = String(idOrName).trim().toUpperCase();
  return CREW_DIRECTORY[key]?.name || idOrName;
}

/**
 * Format an array of employee IDs or names into a comma-separated string of names.
 */
export function formatCrewNames(list) {
  if (!Array.isArray(list) || list.length === 0) return '';
  return [...new Set(list.map(getCrewName).filter(Boolean))].join(', ');
}
