/**
 * Calculates the time needed to travel a certain distance at a given speed.
 *
 * @param {number} distance - in kilometers
 * @param {number} speed - in mph
 * @param {'m' | 'h'} [type='m'] - indicates if the result should be in minutes or hours
 * @return {number} the calculated time in either minutes or hours
 */
export function calculateTime(
  distance: number,
  speed: number,
  type: 'm' | 'h' = 'm',
): number {
  const timeInMinutes = (distance / speed) * 60; // Calculate time in minutes

  if (type === 'h') {
    return Math.round(timeInMinutes / 60); // Convert minutes to hours if type is 'h'
  }

  return Math.round(timeInMinutes); // Return time in minutes
}

export function getReadableBadgeCount(count: number = 0) {
  if (count > 99) {
    return 99;
  }
  return count;
}
